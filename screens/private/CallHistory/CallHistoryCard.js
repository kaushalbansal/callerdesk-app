import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';

import {
  formatCallLogDate,
  calculateTimeDifference,
  getRandomColor,
} from '../../../common/helpers/utils';
import { colors } from '../../../themes/vars';
import { IconOutGoing } from '../../../common/icons/iconoutgoing';
import { IconIncoming } from '../../../common/icons/iconincoming';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import FlexView from '../../../common/components/MyView';
import PropTypes from 'prop-types';

const CallHistoryCard = ({ data }) => {
  const bg = useMemo(() => getRandomColor(), []);
  return (
    <FlexView>
      <View style={styles.layout1}>
        <View style={styles.layout11}>
          <View style={styles.card1}>
            <View style={styles.leftBox}>
              <View style={[styles.circle, { backgroundColor: bg }]}>
                <Text style={styles.layout1Text}>
                  {data.member_name
                    ? data.member_name[0].toLocaleUpperCase()
                    : 'NA'}
                </Text>
              </View>
              <View style={styles.nameBox}>
                <Text style={{ fontSize: rf(1.8) }}>
                  {data.member_name || 'NA'}
                </Text>
                <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                  {formatCallLogDate(data.startdatetime)} By{' '}
                  {data.caller_name || 'Na'}
                </Text>
              </View>
            </View>
            <View style={[styles.rightBox, styles.rightBox1]}>
              <View style={[styles.leftBox, styles.leftBox1]}>
                <Text appearance="hint">
                  {calculateTimeDifference(
                    data.startdatetime,
                    data.enddatetime,
                  )}
                </Text>
              </View>
              <View style={[styles.rightBox, styles.rightBox2]}>
                <TouchableOpacity activeOpacity={0.3} onPress={() => {}}>
                  {data.callstatus === 'ANSWER' ? (
                    <IconOutGoing size={16} color={colors.grey} />
                  ) : (
                    <IconIncoming size={rw(4)} color={colors.grey} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </FlexView>
  );
};

const cirleDim = 45;
const cardH = cirleDim + 15;

const styles = StyleSheet.create({
  card1: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: rw(2),
  },
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
  layout1: {
    alignSelf: `center`,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 3,
    marginVertical: rh(0.5),
    width: rw(97),
  },
  layout11: {
    alignItems: `center`,
    justifyContent: `center`,
    marginBottom: rh(1),
  },
  layout1Text: { color: colors.white, fontSize: rf(1.8) },
  leftBox: { flexDirection: 'row', height: cardH, width: '80%' },
  leftBox1: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  nameBox: {
    height: cardH,
    justifyContent: 'center',
    paddingLeft: rw(1.5),
    width: '80%',
  },
  rightBox: {
    alignItems: 'flex-end',
    flex: 1,
    height: cardH,
    justifyContent: 'center',
    width: '20%',
  },
  rightBox1: { flexDirection: 'row' },
  rightBox2: { alignItems: 'center' },
});

export default CallHistoryCard;
CallHistoryCard.propTypes = {
  data: PropTypes.shape({
    callstatus: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
  }),
};
