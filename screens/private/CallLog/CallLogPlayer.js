/* CallLogPlayer.js */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import Sound from 'react-native-sound';
import { IconPause } from '../../../common/icons/playpause';
import { IconPlay } from '../../../common/icons/iconplay';
import EqualizerAnimation from '../../../common/components/EqualizerAnimation';
import { colors } from '../../../themes/vars';
import PropTypes from 'prop-types';
import { formatPlayerTime } from '../../../common/helpers/utils';

Sound.setCategory && Sound.setCategory('Playback');

const CallLogPlayer = ({ id, callDuration, currentPlayingId, url, setPlayerId }) => {
  const [status, setStatus] = useState('');
  const [timer, setTimer] = useState({ duration: callDuration || '00:00', current: '00:00' });

  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (id !== currentPlayingId && soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
      });
      clearInterval(intervalRef.current);
      setStatus('');
      setTimer({ duration: callDuration || '00:00', current: '00:00' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayingId]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  const updateTimer = () => {
    if (!soundRef.current) return;
    soundRef.current.getCurrentTime((seconds) => {
      setTimer((t) => ({ ...t, current: formatPlayerTime(Math.floor(seconds * 1000)) }));
    });
  };

  const pauseAudio = async () => {
    try {
      if (soundRef.current) {
        soundRef.current.pause();
        setStatus('paused');
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const playMusic = async () => {
    try {
      if (!url) return;
      setStatus('playing');
      setPlayerId(id);
      // If no sound or url changed, create new
      if (!soundRef.current) {
        soundRef.current = new Sound(url, Sound.MAIN_BUNDLE, (err) => {
          if (err) {
            console.log('Sound error', err);
            setStatus('');
            setPlayerId(0);
            soundRef.current && soundRef.current.release();
            soundRef.current = null;
            return;
          }
          soundRef.current.play((success) => {
            if (success) {
              setStatus('');
              setPlayerId(0);
              soundRef.current && soundRef.current.release();
              soundRef.current = null;
              clearInterval(intervalRef.current);
              setTimer((t) => ({ ...t, current: '00:00' }));
            } else {
              setStatus('');
              setPlayerId(0);
              soundRef.current && soundRef.current.release();
              soundRef.current = null;
              clearInterval(intervalRef.current);
            }
          });
          // start interval to update current time
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(updateTimer, 500);
        });
      } else {
        // resume
        soundRef.current.play();
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(updateTimer, 500);
      }
    } catch (error) {
      setStatus('');
      setPlayerId(0);
      console.log(error.message);
    }
  };

  return (
    <>
      {(status === '' || status === 'paused') && (
        <TouchableOpacity onPress={() => playMusic()}>
          <IconPlay />
        </TouchableOpacity>
      )}
      {status === 'playing' && (
        <TouchableOpacity onPress={() => pauseAudio()}>
          <IconPause />
        </TouchableOpacity>
      )}
      <View style={cardStyle.content}>
        {status !== 'playing' && <View style={cardStyle.playing} />}
        {status === 'playing' && <EqualizerAnimation />}
      </View>
      <View>
        <Text category="c2" appearance="hint">
          {timer.current}/{callDuration}
        </Text>
      </View>
    </>
  );
};

const cardStyle = StyleSheet.create({
  content: { alignItems: 'center', flexGrow: 1, justifyContent: 'center' },
  playing: {
    backgroundColor: colors.lightGrey,
    height: 2,
    width: '90%',
  },
});

CallLogPlayer.propTypes = {
  id: PropTypes.string,
  callDuration: PropTypes.number,
  currentPlayingId: PropTypes.string,
  setPlayerId: PropTypes.func,
  url: PropTypes.string,
};

export default CallLogPlayer;
