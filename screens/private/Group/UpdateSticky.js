import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../../themes/vars';
import { rh, rw } from '../../../common/helpers/dimentions';
import { Checkbox } from 'react-native-paper';
import {
  StickyMemberPlaceholder,
  SubmitText,
  stickyText,
  stickyText1,
} from '../../../common/Constants';
import PropTypes from 'prop-types';

const UpdateSticky = ({ group, handleUpdate }) => {
  const [sticky, setSticky] = useState(group.is_sticky);

  const handleCheckboxChange = (sticky) => {
    setSticky(sticky);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.sticky}>
          <Text style={styles.stickyText}>Normal Sticky: </Text>
          {stickyText}
        </Text>
        <Text style={styles.sticky}>
          <Text style={styles.stickyText}>Advance Sticky: </Text>
          {stickyText1}
        </Text>
        <Text style={styles.stickyView}>{StickyMemberPlaceholder}</Text>
        <View style={styles.stickyView1}>
          <View style={styles.chckbxView}>
            <View style={styles.chckbxView1}>
              <Checkbox
                value={sticky === `0` ? 'checked' : 'unchecked'}
                status={sticky === `0` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`0`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={{ textAlign: `center` }}>{'Off'}</Text>
            </View>
          </View>
          <View style={styles.chckbxView}>
            <View style={styles.chckbxView1}>
              <Checkbox
                value={sticky === `1` ? 'checked' : 'unchecked'}
                status={sticky === `1` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`1`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={{ textAlign: `center` }}>{'Advance'}</Text>
            </View>
          </View>
          <View style={styles.chckbxView}>
            <View style={styles.chckbxView1}>
              <Checkbox
                value={sticky === `2` ? 'checked' : 'unchecked'}
                status={sticky === `2` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`2`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={{ textAlign: `center` }}>{'Normal'}</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={styles.btn}
          onPress={() => {
            const obj = {
              ...group,
              is_sticky: sticky,
            };
            handleUpdate(obj);
          }}
        >
          <Text style={styles.btnText}>{SubmitText}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default UpdateSticky;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1.2),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  chckbxView: { alignItems: `center`, flexDirection: `row` },
  chckbxView1: {
    alignItems: `center`,
    justifyContent: `center`,
    marginLeft: rw(-2),
  },
  container: {
    alignSelf: `center`,
    backgroundColor: colors.white,
  },
  sticky: {
    color: colors.black,
    fontSize: rh(1.7),
    fontWeight: `400`,
    marginLeft: rw(0),
    marginVertical: rh(1),
  },
  stickyText: { fontWeight: `700`, lineHeight: 20 },
  stickyView: {
    fontSize: rh(1.8),
    fontWeight: `600`,
    marginLeft: rw(0),
    marginVertical: rh(1),
  },
  stickyView1: { borderBottomColor: colors.swipeBg, borderBottomWidth: 1 },
});
UpdateSticky.propTypes = {
  group: PropTypes.shape({
    group_id: PropTypes.string,
    is_sticky: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    callresult: PropTypes.string,
    contact_status: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    contact_savedate: PropTypes.string,
    startdatetime: PropTypes.string,
    contact_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
  }),
  authcode: PropTypes.string,
  handleUpdate: PropTypes.func,
};
