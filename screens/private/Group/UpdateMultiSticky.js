/* eslint-disable camelcase */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../../themes/vars';
import { rh, rw } from '../../../common/helpers/dimentions';
import { Checkbox } from 'react-native-paper';
import {
  MultiStickyMemberPlaceholder,
  SubmitText,
  multiStickyText,
} from '../../../common/Constants';
import PropTypes from 'prop-types';

const UpdateMultiSticky = ({ group, handleUpdate }) => {
  const [multiSticky, setMultiSticky] = useState(group.is_multi_sticky);
  const handleCheckboxChange = (multi_sticky) => {
    setMultiSticky(multi_sticky);
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.containerView}>{multiStickyText}</Text>
        <Text style={styles.multiSticky}>{MultiStickyMemberPlaceholder}</Text>
        <View style={styles.multiSticky1}>
          <View style={styles.chckbxView}>
            <View style={styles.chckbxView1}>
              <Checkbox
                value={multiSticky === `0` ? 'checked' : 'unchecked'}
                status={multiSticky === `0` ? 'checked' : 'unchecked'}
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
                value={multiSticky === `1` ? 'checked' : 'unchecked'}
                status={multiSticky === `1` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`1`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={{ textAlign: `center` }}>{'On'}</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={styles.btn}
          onPress={() => {
            const obj = {
              ...group,
              is_multi_sticky: multiSticky,
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

export default UpdateMultiSticky;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1.2),
    width: rw(80),
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
  containerView: {
    color: colors.black,
    fontSize: rh(1.7),
    fontWeight: `400`,
    lineHeight: 20,
    marginLeft: rw(0),
    marginVertical: rh(1),
  },
  multiSticky: {
    color: colors.black,
    fontSize: rh(1.8),
    fontWeight: `600`,
    lineHeight: 20,
    marginVertical: rh(1),
  },
  multiSticky1: { borderBottomColor: colors.swipeBg, borderBottomWidth: 1 },
});
UpdateMultiSticky.propTypes = {
  group: PropTypes.shape({
    group_id: PropTypes.string,
    is_multi_sticky: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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
