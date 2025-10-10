/* VoiceTemplate.js */
import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Sound from 'react-native-sound';

import { colors } from '../../../../themes/vars';
import { VoiceTemplateBanner } from '../../../../common/icons/voicetemplatebanner';
import VoicePlayerCard from './VoicePlayerCard';
import CustomHeader from '../../../../common/components/CustomHeader';
import CreateVoiceTemplate from './CreateVoiceTemplate';
import MyText from '../../../../common/components/MyText';
import { MyView } from '../../../../common/components/MyView';
import { rh, rw } from '../../../../common/helpers/dimentions';
import { NoDataFound } from '../../../../common/components/NoDataFound';
import { LocalLoader } from '../../../../common/components/GlobalLoader';
import { VoiceTemLabel } from '../../../../common/Constants';
import { toastShow } from '../../../../common/helpers/utils';

Sound.setCategory && Sound.setCategory('Playback');

const VoiceTemplate = () => {
  const soundRef = useRef(null);
  const { data } = useSelector((state) => state.voiceTemplate);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [playUri, setPlayUri] = useState({ index: -1, uri: '', status: '' });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    setList(data);
    setLoading(false);
  }, [data]);

  useEffect(() => {
    return () => {
      // Cleanup function to stop and unload the audio when the component unmounts
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  const play = async (i, url) => {
    try {
      if (!url) throw new Error('URL is empty or undefined');

      if (playUri.index === i && playUri.status === 'paused') {
        if (soundRef.current) {
          soundRef.current.play();
          setPlayUri((p) => ({ ...p, status: 'playing' }));
          return;
        }
      }

      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }

      soundRef.current = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
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
            toastShow('Playback failed');
            setPlayUri({ index: -1, uri: '', status: '' });
          }
          soundRef.current && soundRef.current.release();
          soundRef.current = null;
          clearInterval(intervalRef.current);
        });

        // optional: start interval to update timers in children (if you support that)
      });
    } catch (error) {
      toastShow('Audio not found');
      setPlayUri({ index: -1, uri: '', status: '' });
    }
  };

  const pause = async () => {
    try {
      if (soundRef.current) {
        soundRef.current.pause();
        setPlayUri((p) => ({ ...p, status: 'paused' }));
      }
    } catch (error) {
      console.log('pause error', error);
    }
  };

  const Card = useCallback(
    ({ item, index }) => {
      if (typeof item === 'string') {
        return (
          <MyView mt={rh(1)}>
            <MyText key={`${item.template_name}`} hint>
              {item}
            </MyText>
          </MyView>
        );
      }

      if (item.length === 0) return null;
      return (
        <VoicePlayerCard
          play={play}
          current={playUri}
          pause={pause}
          itemIndex={index}
          item={item}
          key={`${item.template_name}`}
        />
      );
    },
    [playUri],
  );

  return (
    <>
      <CreateVoiceTemplate open={createModalVisible} onClose={() => setCreateModalVisible(false)} />
      <CustomHeader title={VoiceTemLabel} />
      <View style={[styles.content, { paddingBottom: rh(3) }]}>
        <LocalLoader loading={loading} />
        <VoiceTemplateBanner />
        <ScrollView>
          {list && list.map((item, i) => <Card key={i} index={i} item={item} />)}
          {!list.length && <NoDataFound />}
        </ScrollView>
      </View>
    </>
  );
};

export default VoiceTemplate;

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.white,
    flex: 1,
    height: '100%',
    paddingHorizontal: rw(3.5),
    paddingTop: 16,
  },
});
