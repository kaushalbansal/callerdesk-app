// VersionChecker.js (modular RNFirebase v22+)
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getString,
  getBoolean,
  setDefaults as rcSetDefaults,
  setConfigSettings,
} from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../themes/vars';
import { rf, rh, rw } from '../../common/helpers/dimentions';

const LAST_SHOWN_KEY = 'VERSION_CHECK_LAST_SHOWN';

function toIntSafe(s, fallback = 0) {
  const n = parseInt(String(s || '').replace(/\D/g, ''), 10);
  return isNaN(n) ? fallback : n;
}

/**
 * VersionChecker (modular only)
 *
 * Props:
 *  - showOncePerHours: how long to wait before re-showing optional updates (0 = show every open)
 *  - forceBlocking: when a forced update is required, block Cancel
 *  - minTimeBetweenFetchMs: production fetch interval in ms (default 1 hour)
 *  - debug: boolean to print helpful console logs
 *  - forceShow: dev-only bypass to show modal immediately (use __DEV__ guard at call site)
 */

export default function VersionChecker({
  showOncePerHours = 24, // 0=show every open for optional updates
  forceBlocking = true,  // whether forced update blocks Cancel
  minTimeBetweenFetchMs = 3600000, // 1 hour default for production
  debug = false,         // enable console logs for debugging
  forceShow = false,     // dev: bypass RC and show modal
}) {
  const [checking, setChecking] = useState(true);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [isForce, setIsForce] = useState(false);

  const log = (...args) => debug && console.log('[VersionChecker]', ...args);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const app = getApp();
        const rc = getRemoteConfig(app);

        const currentVersionName = DeviceInfo.getVersion();
        const currentVersionCodeStr = DeviceInfo.getBuildNumber(); // versionCode (android) / build number
        const currentVersionCode = toIntSafe(currentVersionCodeStr, 0);

        // in-app defaults (strings)
        const defaults = {
          latest_version_code: String(currentVersionCode),
          min_supported_version_code: String(currentVersionCode),
          latest_version_name: currentVersionName || '',
          force_update: false,
        };

        // set defaults (modular API)
        try {
          // setDefaults signature varies; try the common modular signature setDefaults(rc, defaults)
          await rcSetDefaults(rc, defaults);
        } catch (e) {
          // fallback: some releases accept setDefaults(defaults)
          try { await rcSetDefaults(defaults); } catch (_) { /* ignore */ }
        }
        log('defaults set', defaults);


         // Configure fetch interval:
        // - In dev, force immediate fetch for quick testing
        // - In prod, use minTimeBetweenFetchMs prop
        try {
          const effectiveMinFetch = __DEV__ ? 0 : (minTimeBetweenFetchMs || 3600000);
          await setConfigSettings(rc, { minimumFetchIntervalMillis: minTimeBetweenFetchMs });
          log('setConfigSettings applied. minFetchMillis=', effectiveMinFetch);
        } catch (e) {
          log('setConfigSettings failed (non-fatal)', e);
        }

        // fetch & activate (modular)
        let activated = false;
        try {
          // fetchAndActivate(rc) is the modular-style call in v22+
          activated = await fetchAndActivate(rc);
          log('fetchAndActivate result:', activated);
        } catch (e) {
          // If the library exposes fetch + activate separately, try them (rare for modular v22)
          try {
            log('fetchAndActivate failed, trying fetch/activate', e);
            // some APIs: await rc.fetch(minTimeBetweenFetchMs); await rc.activate();
            // but modular v22 exposes fetchAndActivate — keep this conservative
          } catch (e2) {
            log('fetch fallback failed', e2);
          }
        }

        // read values (modular getters)
        const latestCodeStr = getString(rc, 'latest_version_code') || String(currentVersionCode);
        const minSupportedCodeStr = getString(rc, 'min_supported_version_code') || String(currentVersionCode);
        const latestName = getString(rc, 'latest_version_name') || currentVersionName;
        const forceFlag = getBoolean(rc, 'force_update') ?? false;
        console.log(forceFlag, 'forceFlag')

        log({ latestCodeStr, minSupportedCodeStr, latestName, forceFlag, currentVersionCode });

        const latestCode = toIntSafe(latestCodeStr, currentVersionCode);
        const minSupportedCode = toIntSafe(minSupportedCodeStr, currentVersionCode);

        const isOlderThanLatest = currentVersionCode < latestCode;
        // const isOlderThanMin = currentVersionCode < minSupportedCode;
        const shouldForce = !!forceFlag;

        // If not older and not debug-forced, nothing to do
        if (!isOlderThanLatest && !forceShow) {
          if (mounted) setChecking(false);
          log('no update required');
          return;
        }

        // rate-limit for optional updates (forced should always show)
        if (!shouldForce && showOncePerHours > 0 && !forceShow) {
          try {
            const last = await AsyncStorage.getItem(LAST_SHOWN_KEY);
            if (last) {
              const lastTs = parseInt(last, 10);
              if (!isNaN(lastTs)) {
                const hoursPassed = (Date.now() - lastTs) / (1000 * 60 * 60);
                if (hoursPassed < showOncePerHours) {
                  if (mounted) setChecking(false);
                  log('skipping show due to rate-limit');
                  return;
                }
              }
            }
          } catch (e) { log('asyncstorage read failed', e); }
        }

        const msg = shouldForce
          ? 'A critical update is required. Please update the app to continue.'
          : `A new version is available. Please update to get latest features and fixes.`;

        if (mounted) {
          setMessage(msg);
          setIsForce(shouldForce);
          setShow(true);
          setChecking(false);
          try { await AsyncStorage.setItem(LAST_SHOWN_KEY, String(Date.now())); } catch (e) { log('asyncstorage set failed', e); }
        }
      } catch (err) {
        console.error('[VersionChecker] Version check failed:', err);
        if (mounted) setChecking(false);
      }
    })();

    return () => { mounted = false; };
  }, [showOncePerHours, minTimeBetweenFetchMs, forceShow, debug]);

  const openPlayStore = async () => {
    const bundleId = DeviceInfo.getBundleId();
    const playMarket = `market://details?id=${bundleId}`;
    const playWeb = `https://play.google.com/store/apps/details?id=${bundleId}`;

    try {
      const supported = await Linking.canOpenURL(playMarket);
      if (supported) {
        await Linking.openURL(playMarket);
        return;
      }
    } catch (e) {
      log('market open failed', e);
    }
    Linking.openURL(playWeb).catch(err => log('Failed to open store URL', err));
  };

  const onCancel = () => {
    if (isForce && forceBlocking) {
      // block (or optionally BackHandler.exitApp())
      return;
    }
    setShow(false);
  };

  if (checking) return null;

  return (
    <Modal visible={show} transparent animationType="fade" onRequestClose={() => { if (!isForce) onCancel(); }}>
      <View style={styles.overlay}>
        <View style={[styles.card]}>
          <Text style={styles.title}>Update available</Text>
          <Text style={styles.body}>{message}</Text>

          <View style={styles.footerButtonContainer}>
            {!isForce && (
              <TouchableOpacity style={styles.btn} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.btn, styles.btnUpdateColor, isForce && styles.forceUpdateButton]} onPress={openPlayStore}>
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.45)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: rw(6), 
    },
    card: { 
        width: '100%', 
        // maxWidth: 420, 
        backgroundColor: '#fff', 
        borderRadius: rw(3), 
        padding: rw(5), 
        alignItems: 'center'
     },
    title: { 
        fontSize: rf(2.5), 
        fontWeight: '600', 
        marginBottom: rh(1) 
    },
    body: { 
        fontSize: rf(1.8), 
        color: '#333', 
        textAlign: 'center', 
        marginBottom: rh(1.8)
    },
    footerButtonContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignSelf: 'stretch',
        alignItems: 'center'
     },
    btn: {
         paddingVertical: rh(1), 
         paddingHorizontal: rw(4.5),
         backgroundColor: '#f2f2f2',
         borderRadius: rw(2), 
         alignItems: 'center'
     },
    btnUpdateColor: { 
        backgroundColor: colors.primary, 
        marginLeft: rw(4),
    },
    forceUpdateButton:{
        width: '50%'
    },
    cancelText: { 
        color: '#333',
        fontSize: rf(1.8),
         fontWeight: '600'
     },
    updateText: { 
        color: '#fff', 
        fontWeight: '600', 
        fontSize: rf(1.8)
    },
});
