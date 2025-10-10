import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { colors } from '../../../themes/vars';
import { rf, rw, rh } from '../../../common/helpers/dimentions';
import { getRandomColor } from '../../../common/helpers/utils';
import PropTypes from 'prop-types';

const MemberItem = ({ member, handleCheckboxChange }) => {
  const bg = useMemo(() => getRandomColor(), []);
  return (
    <View style={styles.addMem31}>
      <View style={[styles.circle, { backgroundColor: bg }]}>
        <Text style={styles.layout1Text}>
          {/* {member.member_name[0].toLocaleUpperCase() + checkbox.label[1].toLocaleUpperCase()} */}
          {member.member_name[0].toLocaleUpperCase()}
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={[styles.center, styles.center2]}>
          {member.member_name}
        </Text>
        <Text style={[styles.center, styles.center3]}>{member.member_num}</Text>
      </View>
      <View style={styles.center1}>
        <Checkbox
          value={member.checked ? 'checked' : 'unchecked'}
          status={member.checked ? 'checked' : 'unchecked'}
          onPress={() => handleCheckboxChange(member)}
          color={colors.blue}
        />
      </View>
    </View>
  );
};

export default MemberItem;
const cirleDim = 45;
const styles = StyleSheet.create({
  addMem31: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.add,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: rh(1),
    width: rw(90),
  },
  center: { marginLeft: rw(2), textAlign: 'left' },
  center1: { alignItems: 'center', flex: 0.5, justifyContent: 'center' },
  center2: { fontSize: rf(2), fontWeight: '400' },
  center3: { color: colors.grey, fontSize: rf(1.8), fontWeight: '400' },
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
  container: { flex: 1 },
  layout1Text: { color: colors.white, fontSize: rf(1.8), fontWeight: '400' },
});
MemberItem.propTypes = {
  member: PropTypes.shape({
    member_name: PropTypes.string,
    checked: PropTypes.bool,
    startdatetime: PropTypes.string,
    contact_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
  }),
  handleCheckboxChange: PropTypes.func,
};
