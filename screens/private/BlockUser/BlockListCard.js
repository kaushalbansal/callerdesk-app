import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { formatCallLogDate } from '../../../common/helpers/utils';
import { colors } from '../../../themes/vars';
import ConfirmUnblock from './ConfirmUnblock';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { Text } from '@ui-kitten/components';
import { IconBlockUser } from '../../../common/icons/iconblockuser';
import PropTypes from 'prop-types';
import { IconBlockNew } from '../../../common/icons/iconblocknew';

const BlockListCard = ({ data, reload, onSelect }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <ConfirmUnblock
        data={data}
        reload={reload}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      <View style={{ alignItems: `center` }}>
        <View style={styles.layout1}>
          <View style={styles.leftBox}>
            <View style={[styles.circle, { backgroundColor: `#5C4033` }]}>
              <Text style={styles.layout1Text}>
                {data?.caller_no
                  ? data?.caller_no[0]?.toLocaleUpperCase() +
                    data?.caller_no[1]?.toLocaleUpperCase()
                  : 'NA'}
              </Text>
              <View style={{ position: `absolute` }}>
                <IconBlockNew size={rw(6)} />
              </View>
            </View>
            <View style={styles.nameBox}>
              <Text style={{ fontSize: rf(1.8) }}>
                {data.caller_no || 'Na'}
              </Text>
              <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                {formatCallLogDate(data.created_at)}
              </Text>
            </View>
          </View>
          <View style={[styles.rightBox, styles.rightBox1]}>
            <View style={[styles.rightBox, styles.rightBox2]}>
              <TouchableOpacity
                style={{ marginHorizontal: rw(1.2) }}
                activeOpacity={0.3}
                onPress={() => onSelect(data)}
              >
                <IconBlockUser size={rw(5)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const cirleDim = 45;
const cardH = cirleDim + 15;
const styles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: `2%`,
    paddingHorizontal: rw(2),
    paddingVertical: rh(1),
    width: rw(95),
  },
  layout1Text: { color: colors.grey, fontSize: rf(1.8) },
  leftBox: {
    flexDirection: 'row',
    height: cardH,
    marginLeft: rw(2),
    width: rw(65),
  },
  nameBox: {
    height: cardH,
    justifyContent: 'center',
    marginLeft: rw(3),
    paddingLeft: rw(1.5),
    width: '80%',
  },
  rightBox: {
    alignItems: 'flex-end',
    flex: 1,
    height: cardH,
    justifyContent: 'center',
    marginRight: rw(2),
    width: rw(20),
  },
  rightBox1: { flexDirection: 'row' },
  rightBox2: { alignItems: 'center', flexDirection: `row` },
});

export default BlockListCard;

BlockListCard.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    caller_no: PropTypes.string,
    created_at: PropTypes.string,
  }),
  reload: PropTypes.func,
  onSelect: PropTypes.func,
};
