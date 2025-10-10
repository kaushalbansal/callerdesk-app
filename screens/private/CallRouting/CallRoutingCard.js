import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import {
  formatCallLogDate,
  formatTotalTime,
} from '../../../common/helpers/utils';
import { colors } from '../../../themes/vars';
import { IconRouting } from '../../../common/icons/iconrouting';
import { IconArrowPointedRight } from '../../../common/icons/iconarrowpointedright';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { DNoLabel, MNoLabel, MinLabel } from '../../../common/Constants';
import PropTypes from 'prop-types';

const CallRoutingCard = ({ data, type }) => {
  return (
    <>
      <View style={styles.container1}>
        <View style={styles.card}>
          <View style={styles.container2}>
            <Text>{type === `app` ? data.caller_num : data.member_num}</Text>
            <Text style={styles.hint} appearance="hint">
              {MNoLabel}
            </Text>
            <View style={styles.arrow}>
              <IconArrowPointedRight />
            </View>
          </View>
          <View style={styles.container3}>
            <View>
              <Text>
                {type === `app`
                  ? data.member_num === '0'
                    ? data.caller_num
                    : data.member_num
                  : data.caller_num}
              </Text>
              <Text style={styles.hint} appearance="hint">
                {DNoLabel}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row1}>
              <Text style={styles.text}>
                {formatTotalTime(data.total_duration)} {MinLabel}{' '}
              </Text>
              <IconRouting color={colors.primary} />
            </View>
            <Text style={styles.hint} appearance="hint">
              {' '}
              {formatCallLogDate(data.startdatetime, ' | ')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  arrow: { position: 'absolute', right: rw(0), top: rh(2.2) },
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    height: 60,
    justifyContent: 'space-between',
  },
  container1: {
    borderBottomWidth: 1,
    borderColor: colors.redBorder,
    minHeight: 10,
  },
  container2: { flexGrow: 2 },
  container3: { alignItems: 'center', flexGrow: 2 },
  hint: {
    fontSize: rf(1.5),
  },
  row: { alignItems: 'flex-end', flexGrow: 1 },
  row1: { flexDirection: 'row', justifyContent: 'flex-end' },
  text: { fontWeight: 'bold', paddingLeft: 4 },
});

export default CallRoutingCard;
CallRoutingCard.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    total_duration: PropTypes.string,
  }),
  type: PropTypes.string,
};
