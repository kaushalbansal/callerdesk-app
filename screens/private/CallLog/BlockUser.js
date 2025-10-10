/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
import { Button } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { colors } from '../../../themes/vars';

import ModalBottom from '../../../common/components/ModalBottom';
import { IconBlock } from '../../../common/icons/blockuser';
import { BlockUnblockUser } from '../../../common/redux/actions/callLog';
import FlexView, { MyView } from '../../../common/components/MyView';
import { rh, rw } from '../../../common/helpers/dimentions';
import MyText from '../../../common/components/MyText';
import {
  BlockButton,
  BlockText,
  BlockTextNewLine,
  BlockUserNew,
  UnblockButton,
  filterObj,
  initCallResult,
  initStatus,
} from '../../../common/Constants';
import PropTypes from 'prop-types';

const BlockUser = ({ data, open, onClose = () => {} }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [filtersLog, setFiltersLog] = useState({
    ...filterObj,
    callstatus: [...initStatus.total],
    callresult: initCallResult.total,
  });
  const blockUnblockUser = () => {
    dispatch(
      BlockUnblockUser(
        data?.authcode,
        data?.type === `app`
          ? data?.member_num === '0'
            ? data?.caller_num
            : data?.member_num
          : data?.caller_num,
        data?.block === 'NO',
        filtersLog,
      ),
    );

    onClose();
  };

  return (
    <ModalBottom
      height="24%"
      title={BlockUserNew}
      open={open}
      onClose={onClose}
    >
      <FlexView type="lr">
        <MyView w="10%">
          <IconBlock strokeW={0.7} size={rw(7)} color={colors.primary} />
        </MyView>
        <MyView w="90%">
          <MyText responsiveSize={1.8}>
            {BlockText}{' '}
            <MyText responsiveSize={1.8} color={colors.primary}>
              {data?.type === `app`
                ? data?.member_num === '0'
                  ? data?.caller_num
                  : data?.member_num
                : data?.caller_num}
            </MyText>
            {BlockTextNewLine}
          </MyText>
        </MyView>
      </FlexView>

      <MyView mb={rh(3)} mt={rh(3)}>
        <Button onPress={() => blockUnblockUser()}>
          {data?.block === 'NO' ? BlockButton : UnblockButton}
        </Button>
      </MyView>
    </ModalBottom>
  );
};

export default BlockUser;
BlockUser.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    file: PropTypes.string,
    block: PropTypes.string,
    authcode: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
