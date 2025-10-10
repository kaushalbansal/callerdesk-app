/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
import { Button } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../../themes/vars';

import ModalBottom from '../../../common/components/ModalBottom';
import { IconBlock } from '../../../common/icons/blockuser';
import { BlockUnblockUser } from '../../../common/redux/actions/callLog';
import FlexView, { MyView } from '../../../common/components/MyView';
import { rh, rw } from '../../../common/helpers/dimentions';
import MyText from '../../../common/components/MyText';
import {
  BlockText,
  BlockTextNewLine,
  BlockUserNew,
  UnblockButton,
  filterObj,
  initCallResult,
  initStatus,
} from '../../../common/Constants';
import PropTypes from 'prop-types';

const BlockUserList = ({ data, open, onClose = () => {} }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [filtersLog, setFiltersLog] = useState({
    ...filterObj,
    callstatus: [...initStatus.total],
    callresult: initCallResult.total,
  });
  const { user } = useSelector((state) => state.global);

  const blockUnblockUser = () => {
    dispatch(
      BlockUnblockUser(user?.authcode, data?.caller_no, false, filtersLog),
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
          {data?.caller_no && (
            <MyText responsiveSize={1.8}>
              {BlockText}{' '}
              <MyText responsiveSize={1.8} color={colors.primary}>
                {data?.caller_no}
              </MyText>
              {BlockTextNewLine}
            </MyText>
          )}
        </MyView>
      </FlexView>

      <MyView mb={rh(3)} mt={rh(3)}>
        <Button onPress={() => blockUnblockUser()}>{UnblockButton}</Button>
      </MyView>
    </ModalBottom>
  );
};

export default BlockUserList;
BlockUserList.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callresult: PropTypes.string,
    caller_no: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
