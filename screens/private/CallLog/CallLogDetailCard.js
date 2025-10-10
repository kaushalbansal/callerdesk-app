/* CallLogDetailCard.js */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import Sound from 'react-native-sound';

import { toastShow } from '../../../common/helpers/utils';
import { colors } from '../../../themes/vars';
import { IconOutGoing } from '../../../common/icons/iconoutgoing';
import { IconIncoming } from '../../../common/icons/iconincoming';
import { IconDownload } from '../../../common/icons/download';
import { IconRouting } from '../../../common/icons/iconrouting';
import { IconBlock } from '../../../common/icons/blockuser';
import { rh, rw } from '../../../common/helpers/dimentions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallPhone } from '../../../common/icons/callphone';
import NewCallLogPlayer from '../Profile/VoiceTemplate/NewCalllogPlayer';
import { styles } from '../../../themes/styles';
import PropTypes from 'prop-types';

Sound.setCategory && Sound.setCategory('Playback'); // optional

const CallLogDetailCard = ({
  data,
  bg,
  index,
  customerName,
  modalUpdate = () => {},
  callRouting = () => {},
  dialerOpen = () => {},
}) => {
  const _defaultModal = {
    whatsapp: false,
    blockUser: false,
    paymentUpi: false,
    businessAddress: false,
    editContact: false,
    fileDownload: false,
  };

  const [playUri, setPlayUri] = useState({
    index: -1,
    uri: data?.file || '',
    status: '',
  });

  // holds Sound instance
  const soundRef = useRef(null);

  // Play URL i with index i
  const play = async (i, url) => {
    try {
      if (!url) throw new Error('URL is empty or undefined');

      // If same index and paused -> resume
      if (playUri.index === i && playUri.status === 'paused') {
        if (soundRef.current) {
          soundRef.current.play((success) => {
            if (success) {
              // ended
              setPlayUri({ index: -1, uri: '', status: '' });
              soundRef.current && soundRef.current.release();
              soundRef.current = null;
            }
          });
          setPlayUri((p) => ({ ...p, status: 'playing' }));
          return;
        }
      }

      // If different track loaded -> stop & release
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }

      // Create new Sound (remote URL supported)
      soundRef.current = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          // sometimes you need to pass null as basePath; if error try fallback:
          // soundRef.current = new Sound(url, null, cb)
          toastShow('Audio not found');
          setPlayUri({ index: -1, uri: '', status: '' });
          soundRef.current && soundRef.current.release();
          soundRef.current = null;
          return;
        }

        setPlayUri({ index: i, uri: url, status: 'playing' });

        soundRef.current.play((success) => {
          if (success) {
            setPlayUri({ index: -1, uri: '', status: '' });
          } else {
            // playback failed (e.g. network)
            toastShow('Playback failed');
            setPlayUri({ index: -1, uri: '', status: '' });
          }
          // release after play finished/failed
          soundRef.current && soundRef.current.release();
          soundRef.current = null;
        });
      });
    } catch (err) {
      toastShow('Audio not found');
      setPlayUri({ index: -1, uri: '', status: '' });
      if (soundRef.current) {
        soundRef.current.release();
        soundRef.current = null;
      }
    }
  };

  const pause = async () => {
    try {
      if (soundRef.current) {
        soundRef.current.pause();
        setPlayUri((p) => ({ ...p, status: 'paused' }));
      }
    } catch (error) {
      // ignore
    }
  };

  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();

  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
    // cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }
    };
  }, []);

  return (
    <View style={cardStyle.container}>
      <View style={[cardStyle.leftBox, cardStyle.leftBox1]}>
        <View style={[cardStyle.circle, { backgroundColor: bg }]}>
          <Text style={styles.circle}>
            {data.caller_name ? data.caller_name[0].toLocaleUpperCase() : 'U'}
          </Text>
        </View>
      </View>
      <View style={[cardStyle.rightBox, { marginTop: rh(-3) }]}>
        <View style={styles.customerName}>
          <View style={cardStyle.fstRowLeft}>
            <Text>{customerName || `Unknown`}</Text>
          </View>
          <View style={cardStyle.fstRowRight}>
            {data.callstatus === 'ANSWER' ? (
              <IconOutGoing size={16} color={colors.grey} />
            ) : (
              <IconIncoming size={16} color={colors.grey} />
            )}
          </View>
        </View>
        <NewCallLogPlayer
          play={play}
          current={playUri}
          pause={pause}
          itemIndex={index}
          item={data}
          key={data.id}
        />
        <View style={styles.download}>
          <TouchableOpacity
            disabled={data.total_duration === '0' || data.file === ''}
            style={
              data.total_duration === '0' || data.file === ''
                ? cardStyle.disableFileDownload
                : null
            }
            onPress={() => {
              modalUpdate({ ..._defaultModal, fileDownload: true }, data);
            }}
          >
            <IconDownload size={16} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => callRouting(data)}>
            <IconRouting color={colors.primary} size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => modalUpdate({ ..._defaultModal, blockUser: true }, data)}
          >
            <IconBlock size={16} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => dialerOpen(data, role)}>
            <CallPhone size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
CallLogDetailCard.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    callstatus: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
  }),
  bg: PropTypes.string,
  index: PropTypes.number,
  customerName: PropTypes.string,
  modalUpdate: PropTypes.func,
  callRouting: PropTypes.func,
  dialerOpen: PropTypes.func,
};
const cirleDim = 45;
const cardH = cirleDim + 15;

const cardStyle = StyleSheet.create({
  circle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: cirleDim,
    elevation: 4,
    height: cirleDim,
    justifyContent: 'center',
    width: cirleDim,
  },
  container: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: colors.callLogCard,
    borderRadius: 10,
    flexDirection: 'row',
    height: rh(14.7),
    justifyContent: 'center',
    marginVertical: rh(0),
    paddingHorizontal: `3%`,
    width: rw(93.5),
  },
  fstRowLeft: {
    width: rw(50),
  },
  fstRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: rw(20),
  },
  leftBox: {
    flexDirection: 'row',
    height: cardH,
    width: '15%',
  },
  leftBox1: { marginTop: rh(-6) },
  rightBox: {
    flexDirection: 'column',
    height: cardH,
    justifyContent: 'space-between',
    paddingLeft: 8,
    width: '85%',
  },
  disableFileDownload:{
    opacity: 0.3,
  }
});

export default CallLogDetailCard;
