import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';
import { IconPause } from '../../../../common/icons/playpause';
import { IconPlay } from '../../../../common/icons/iconplay';
import EqualizerAnimation, {
  EqualizerStatic,
} from '../../../../common/components/EqualizerAnimation';
import FlexView, { MyView } from '../../../../common/components/MyView';
import PropTypes from 'prop-types';

const VoicePlayerCard = ({
  item,
  itemIndex,
  play,
  pause,
  current = { index: -1, uri: '', status: '' },
}) => {
  const playing = current.status === 'playing' && itemIndex === current.index;
  const paused = current.status === 'paused' && itemIndex === current.index;

  const handlePress = () => {
    console.log(
      `Button pressed. Current status: ${current.status}, Index: ${itemIndex}`,
    );
    if (playing) {
      console.log('Pausing the audio.');
      pause();
    } else {
      console.log(`Playing the audio from URL: ${item.template_url}`);
      play(itemIndex, item.template_url)
        .then(() => console.log('Audio started playing successfully'))
        .catch((error) => console.error('Error playing audio:', error));
    }
  };

  return (
    item.template_name && (
      <View style={[styles.card, styles.card1]}>
        <View style={styles.cardFlex}>
          <View style={styles.cardWidth}>
            <View
              style={playing || paused ? styles.circle1 : styles.circle2}
            ></View>
          </View>
          <View style={styles.cardWidth1}>
            <Text>{item.template_name}</Text>
          </View>
        </View>

        <View style={styles.playPauseStyle}>
          <TouchableOpacity style={styles.cardWidth} onPress={handlePress}>
            <MyView>{playing ? <IconPause /> : <IconPlay />}</MyView>
          </TouchableOpacity>
          <MyView w="70%">
            {playing ? (
              <FlexView bg="transparent">
                <EqualizerAnimation />
              </FlexView>
            ) : (
              <EqualizerStatic />
            )}
          </MyView>
          {/* <EqualizerAnimation playing={playing} bars={30} minH={4} maxH={14} /> */}
        </View>
      </View>
    )
  );
};

export default VoicePlayerCard;

const styles = StyleSheet.create({
  card: {
    borderColor: colors.redBorder,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
  },
  card1: { marginTop: 8 },
  cardFlex: { flexDirection: 'row' },
  cardWidth: { width: '10%' },
  cardWidth1: { width: '90%' },
  circle1: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    height: 15,
    width: 15,
  },
  circle2: {
    borderColor: colors.grey,
    borderRadius: 15,
    borderWidth: 2.5,
    height: 15,
    width: 15,
  },
  playPauseStyle: { flexDirection: 'row', marginTop: 8 },
});

VoicePlayerCard.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  play: PropTypes.func,
  pause: PropTypes.func,
  itemIndex: PropTypes.number,
  current: PropTypes.object,
};
