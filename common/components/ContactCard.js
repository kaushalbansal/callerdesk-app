import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';

import { BlueContactIcon } from '../icons/contactsblue';
import { colors } from '../../themes/vars';
import { getRandomColor } from '../helpers/utils';
import PropTypes from 'prop-types';

const ContactCard = ({ data }) => {
  const bg = useMemo(() => getRandomColor(), []);

  return (
    <>
      <View style={cardStyle.container}>
        <View style={[cardStyle.leftBox, {}]}>
          <View style={[cardStyle.circle, { backgroundColor: bg }]}>
            <Text style={cardStyle.memberNameStyle}>
              {data.member_name
                ? data.member_name[0].toLocaleUpperCase()
                : 'NA'}
            </Text>
          </View>
          <View style={cardStyle.nameBox}>
            <Text>{data.member_name || 'NA'}</Text>
            <Text appearance="hint">{data.contact_num}</Text>
          </View>
        </View>
        <View style={cardStyle.rightBox}>
          <TouchableOpacity activeOpacity={0.3} onPress={() => {}}>
            <BlueContactIcon />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const cardStyle = StyleSheet.create({
  circle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.white,
    borderRadius: 45,
    borderWidth: 4,
    height: 45,
    justifyContent: 'center',
    width: 45,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    paddingLeft: 24,
    paddingRight: 24,
  },
  leftBox: {
    flexDirection: 'row',
    height: 60,
    width: '80%',
  },
  memberNameStyle: { color: colors.white, fontSize: 18 },
  nameBox: {
    height: 60,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  rightBox: {
    alignItems: 'flex-end',
    flex: 1,
    height: 60,
    justifyContent: 'center',
    width: '20%',
  },
});

export default ContactCard;
ContactCard.propTypes = {
  data: PropTypes.shape({
    contact_num: PropTypes.string,
    member_name: PropTypes.string,
  }),
  setPlayerId: PropTypes.func,
  playerId: PropTypes.number,
  index: PropTypes.number,
  reloadCallLog: PropTypes.func,
  getAgentName: PropTypes.func,
  getCustomerName: PropTypes.func,
  onSelect: PropTypes.func,
  filters: PropTypes.object,
};
