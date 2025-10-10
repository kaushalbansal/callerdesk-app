import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';

import { ConfirmWA, SendLabel } from '../../../../common/Constants';
import { navigateToLink, normalizePhoneNumber } from '../../../../common/helpers/utils';
import { rh, rw } from '../../../../common/helpers/dimentions';
import ModalMid from '../../../../common/components/ModalMid';
import PropTypes from 'prop-types';
import TextInputWithIcon from '../../../../common/components/textinputwithicon';

const WAConfirm = ({
  fromScreen,
  open,
  onClose = () => {},
  data,
  from,
  url,
}) => {
  const [mobileNo, setMobileNo] = React.useState(
    fromScreen === `contact`
      ? data.caller_num
        ? data.caller_num
        : data.contact_num
      : fromScreen ==="SimLog" ?  normalizePhoneNumber(data.number) : data.type === `app`
        ? data.member_num === '0'
          ? data.caller_num.slice(-10)
          : data.member_num.slice(-10)
        : data.caller_num,
  );
  console.log(`WAConfirm??`, fromScreen, from);
  console.log(`mobileNo??`, data);
  const wappUrl =
    from === `payment` ? `${url}${mobileNo}` : `${url}${mobileNo}`;
  const closeFunc = () => {
    onClose();
    setMobileNo(
      fromScreen === `contact`
        ? data.caller_num
          ? data.caller_num
          : data.contact_num
        : fromScreen==="SimLog"? normalizePhoneNumber(data.number) : data.type === `app`
          ? data.member_num === '0'
            ? data.caller_num.slice(-10)
            : data.member_num.slice(-10)
          : data.caller_num,
    );
  };
  return (
    <ModalMid
      height="24%"
      title={ConfirmWA}
      open={open}
      onClose={closeFunc}
      from={`payment`}
    >
      <View style={styles.container}>
        <TextInputWithIcon
          defaultValue={mobileNo}
          inputMode={`number-pad`}
          onChangeText={(text) => setMobileNo(text)}
        ></TextInputWithIcon>
        <Pressable
          style={styles.btn}
          onPress={() => {
            console.log(wappUrl);
            navigateToLink(wappUrl);
          }}
        >
          <Text style={styles.btnText}>{SendLabel}</Text>
        </Pressable>
      </View>
    </ModalMid>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(0),
    paddingVertical: rh(1),
    width: rw(80),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  container: { alignItems: 'center', gap: 10, justifyContent: 'center' },
});

export default WAConfirm;
WAConfirm.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    contact_num: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  open: PropTypes.bool,
  from: PropTypes.string,
  fromScreen: PropTypes.string,
  url: PropTypes.string,
  onClose: PropTypes.func,
};
