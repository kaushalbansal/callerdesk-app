import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { Text, ProgressBar } from '@ui-kitten/components';
import RNFS from 'react-native-fs';
// import Share from 'react-native-share';

import { colors } from '../../../themes/vars';
import ModalBottom from '../../../common/components/ModalBottom';
import { IconFolder } from '../../../common/icons/iconfolder';
import { IconPause } from '../../../common/icons/playpause';
import { IconPlay } from '../../../common/icons/iconplay';
import { IconClose } from '../../../common/icons/iconclose';
import { DownloadLabel } from '../../../common/Constants';
import { toastShow } from '../../../common/helpers/utils';
import PropTypes from 'prop-types';

// Helper function: Request external storage permission (for Android devices below API 29)
const requestExternalStoragePermission = async () => {
  try {
    const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (alreadyGranted) return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Required",
        message: "This app needs access to your storage to download files to your public downloads folder",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};


const CallDownload = ({ data, open, onClose = () => {} }) => {
  const [paused, setPaused] = useState(false);
  const [info, setFileInfo] = useState({ size: '0' });
  const [isCompleted, setCompleted] = useState(false);
  const [progress, setDownloadProgress] = useState(0);
  const downloadTaskRef = useRef(null);
  const permissionCheckedRef = useRef(false);


  // Extract the file extension and create a unique file name using a timestamp
  const ext = data.file.split('.').pop();
  const baseName = data.member_name || data.member_num;
  const uniqueSuffix = Date.now();
  const fileName = `${baseName}_recording_${uniqueSuffix}.${ext}`;

  // Determine file path based on platform
  const filePath =
    Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/${fileName}`
      : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  const checkAndRequestPermissions = async () => {
    if (Platform.OS === 'ios' || Platform.Version >= 29) return true;
    if (permissionCheckedRef.current) return true;

        const hasPermission = await requestExternalStoragePermission();
        permissionCheckedRef.current = hasPermission;
        return hasPermission;
  };

  const startDownload = async () => {

    // Check for required permissions on Android
    const permissionGranted = await checkAndRequestPermissions();
    if (!permissionGranted) {
      if (Platform.OS === 'android') {
        ToastAndroid.show("Storage permission denied", ToastAndroid.SHORT);
      }
      onClose();
      return;
    }

    if (data.file) {
      const downloadOptions = {
        fromUrl: data.file,
        toFile: filePath,
        progressDivider: 1,
        progress: (res) => {
          if(res.contentLength>0){
            const progressFraction=res.bytesWritten / res.contentLength;
            setDownloadProgress(progressFraction)
            const totalSizeMB=(res.contentLength / (1024 * 1024)).toFixed(2);
            setFileInfo({size: totalSizeMB})
          }
        }
      };

      downloadTaskRef.current = RNFS.downloadFile(downloadOptions);
      downloadTaskRef.current.promise
        .then((result) => {
          if (result.statusCode === 200) {
            setDownloadProgress(1)
            setCompleted(true);
            showSuccessMessage();
            // For iOS, we can enable a share option once download is complete.
            if (Platform.OS === 'ios') {
              // promptShare();
            }
            onClose();
          } else {
            toastShow(`Download failed with status code: ${result.statusCode}, Please try again!`);
            onClose();
            // throw new Error(`Download failed with status code: ${result.statusCode}`);
          }
        })
        .catch((error) => {
          console.error("Download error:", error);
          toastShow('Download failed, Please try again!');
          onClose();
        });
    } else {
      toastShow(`No file to download`);
      onClose();
    }
  };

  const pauseDownload = () => {
    if (downloadTaskRef.current) {
      downloadTaskRef.current.stop();
      setPaused(true);
    }
  };

  const resumeDownload = () => {
    if (paused) {
      startDownload(); // Restart the download
      setPaused(false);
    }
  };

  const cancelDownload = () => {
    if (downloadTaskRef.current) {
      downloadTaskRef.current.stop();
      toastShow('Download cancelled.');
      setDownloadProgress(0);
    }
  };

  
  const showSuccessMessage = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Download completed!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Download completed');
    }
  };

  // iOS sharing functionality
  const promptShare = async () => {
    try {
      const shareOptions = {
        url: `file://${filePath}`, // ensuring file URL format on iOS
        title: 'Share File',
        type: `audio/${ext}`  // adjust the MIME type as needed
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error("Share error:", error);
      toastShow("Failed to share file.");
    }
  };

  useEffect(() => {
    startDownload();
  }, []);

  return (
    data.file && (
      <ModalBottom height="22%" title={DownloadLabel} open={open} onClose={onClose}>
        <View style={styles.container}>
          <View style={styles.container1}>
            <IconFolder size={45} />
          </View>
          <View style={styles.fileView}>
            <Text style={styles.fileName}>{fileName}</Text>
            <Text appearance="hint" style={styles.infoText}>
              {info.size} MB
            </Text>
            <View style={styles.progressView1}>
              <View style={styles.progressView}>
                <ProgressBar size="medium" style={styles.progress} progress={progress} />
              </View>
              <View style={[styles.controls, {opacity: isCompleted ? 0.2 : 1}]}>
                <TouchableOpacity
                  disabled={isCompleted}
                  onPress={() => {
                    setPaused(!paused);
                    if (!paused) {
                      pauseDownload();
                    } else {
                      resumeDownload();
                    }
                  }}
                >
                  {paused ? <IconPlay size={14} /> : <IconPause size={14} />}
                </TouchableOpacity>
                <TouchableOpacity disabled={isCompleted} onPress={cancelDownload}>
                  <IconClose size={9} />
                </TouchableOpacity>
                {Platform.OS === 'ios' && isCompleted && (
                  <TouchableOpacity onPress={promptShare}>
                    <Text style={{ color: 'blue' }}>Share</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </ModalBottom>
    )
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 16, marginTop: 8 },
  container1: { width: '13%' },
  fileName: { fontSize: 16, textAlign: 'center' },
  fileView: { alignItems: 'flex-start', flexWrap: 'wrap', width: '87%' },
  infoText: { fontSize: 16, textAlign: 'center' },
  progress: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
  },
  progressView: { width: '80%' },
  progressView1: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 0,
    width: '100%',
  },
  controls: {
    width: '20%',
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
    alignItems: 'center',
  }
});

CallDownload.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string.isRequired,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default CallDownload;
