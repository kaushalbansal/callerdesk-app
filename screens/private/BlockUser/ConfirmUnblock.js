import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../../themes/vars';
import ModalBottom from '../../../common/components/ModalBottom';
import { BlockUnblockUser } from '../../../common/redux/actions/callLog';
import {
  BlockTextNewLine,
  BlockUser,
  UnblockButton,
} from '../../../common/Constants';
import { rh } from '../../../common/helpers/dimentions';
import PropTypes from 'prop-types';

const ConfirmUnblock = ({
  data,
  open,
  reload = () => {},
  onClose = () => {},
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.global);

  const blockUnblockUser = () => {
    dispatch(
      BlockUnblockUser(
        user?.authcode,
        data.type === `app`
          ? data.member_num === '0'
            ? data.caller_num
            : data.member_num
          : data.caller_num,
        false,
        () => {
          reload();
        },
      ),
    );
    onClose();
  };

  return (
    <ModalBottom height="26%" title={BlockUser} open={open} onClose={onClose}>
      <View style={cardStyle.container}>
        <View style={cardStyle.container1}>
          <View style={cardStyle.container2}>
            <Text style={cardStyle.containerText}>
              {data.type === `app`
                ? data.member_num === '0'
                  ? data.caller_num
                  : data.member_num
                : data.caller_num}
            </Text>
            <Text style={cardStyle.text}>{BlockTextNewLine}</Text>
          </View>
        </View>
      </View>
      <Button onPress={() => blockUnblockUser()}>{UnblockButton}</Button>
    </ModalBottom>
  );
};

const cardStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  container1: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'center',
  },
  container2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: `center`,
    marginTop: rh(1),
    width: '89%',
  },
  containerText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  text: { fontSize: 16, textAlign: 'center' },
});

export default ConfirmUnblock;
ConfirmUnblock.propTypes = {
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
  }),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  reload: PropTypes.func,
};
