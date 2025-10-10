import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../../themes/vars';
import { rh, rw } from '../../../common/helpers/dimentions';
import { AddLabel } from '../../../common/Constants';
import MemberItem from './MemberItem';
import PropTypes from 'prop-types';

const AddMember = ({ members, handleUpdate, group }) => {
  const [checkboxes, setCheckboxes] = useState(
    members.map((member) => ({ ...member, checked: false })),
  );
  const [memberIdArr, setMemberIdArr] = useState([]);

  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((member) =>
        member.member_id === id
          ? { ...member, checked: !member.checked }
          : member,
      ),
    );
  };

  const handleCheckboxChangeAll = () => {
    setMemberIdArr([]);
    checkboxes.forEach((item) => {
      if (item.checked) {
        memberIdArr.push(parseInt(item.member_id, 10));
      }
    });
    const obj = {
      ...group,
      member_id: memberIdArr,
    };
    handleUpdate(obj);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.addMem3}>
        {checkboxes.map((member, index) => (
          <MemberItem
            key={index}
            member={member}
            handleCheckboxChange={() => handleCheckboxChange(member.member_id)}
          />
        ))}
      </View>
      <Pressable style={styles.btn} onPress={handleCheckboxChangeAll}>
        <Text style={styles.btnText}>{AddLabel.toUpperCase()}</Text>
      </Pressable>
    </ScrollView>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  addMem3: { borderBottomColor: colors.swipeBg, borderBottomWidth: 1 },
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1.2),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 5,
  },
});

AddMember.propTypes = {
  members: PropTypes.array,
  handleUpdate: PropTypes.func,
  group: PropTypes.object,
};
