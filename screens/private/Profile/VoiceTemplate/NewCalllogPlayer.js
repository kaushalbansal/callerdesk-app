import  { StyleSheet, View, TouchableOpacity } from 'react-native';

import { IconPause } from '../../../../common/icons/playpause';
import { IconPlay } from '../../../../common/icons/iconplay';
import EqualizerAnimation, {
  EqualizerStatic,
} from '../../../../common/components/EqualizerAnimation';
import { MyView } from '../../../../common/components/MyView';
import PropTypes from 'prop-types';

const NewCallLogPlayer = ({
  mt = 8,
  item,
  itemIndex,
  play,
  pause,
  current = { index: -1, uri: '', status: '' },
}) => {
  const playing = current.status === 'playing' && itemIndex === current.index;
  // eslint-disable-next-line no-unused-vars
  const paused = current.status === 'paused' && itemIndex === current.index;
  const handlePress = () => {
    console.log(
      `Button pressed. Current status: ${current.status}, Index: ${itemIndex}`,
    );
    if (playing) {
      console.log('Pausing the audio.');
      pause();
    } else {
      console.log(`Playing the audio from URL: ${item.file}`);
      play(itemIndex, item.file)
        .then(() => console.log('Audio started playing successfully'))
        .catch((error) => console.error('Error playing audio:', error));
    }
  };

  return (
    <View style={{ marginTop: mt }}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.card1} onPress={handlePress}>
          <MyView>{playing ? <IconPause /> : <IconPlay />}</MyView>
        </TouchableOpacity>
        {playing ? <EqualizerAnimation /> : <EqualizerStatic />}
        {/* <EqualizerAnimation playing={playing} bars={30} minH={4} maxH={14} /> */}
      </View>
    </View>
  );
};

export default NewCallLogPlayer;

const styles = StyleSheet.create({
  card: { flexDirection: 'row', marginTop: 8 },
  card1: { width: '10%' },
});

NewCallLogPlayer.propTypes = {
  mt: PropTypes.number,
  itemIndex: PropTypes.number,
  play: PropTypes.func,
  pause: PropTypes.func,
  current: PropTypes.object,
  item: PropTypes.object,
};
