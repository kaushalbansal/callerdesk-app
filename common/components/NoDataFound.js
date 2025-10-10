import React from 'react';
import { View } from 'react-native';
import  MissedCallSvg from './missedcallsvg';
import { rw } from '../helpers/dimentions';
import  NoTotalCallSvg  from './nototalcallsvg';
import { NoContacts } from './nocontacts';
import  BlockedUsersSvg  from './blockeduserssvg';
import  NoGroupSvg  from './nogroupsvg';
import  NoVoiceSvg  from './novoicesvg';
import PropTypes from 'prop-types';
import  NoMemberSvg  from './nomembersvg';
import AnswerCallSvg from './answercallsvg';

export const NoDataFound = ({ msg, size = 100.63626, h = 350, style = {} }) => {
  return (
    <>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: rw(90),
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
          ...style,
        }}
      >
        {msg === `missed` && <MissedCallSvg />}
        {msg === `total` && <NoTotalCallSvg />}
        {msg === `answered` && <AnswerCallSvg />}
        {msg === `cancel-Agent` && <MissedCallSvg />}
        {msg === `Cancel-Customer` && <MissedCallSvg />}
        {msg === `no-contacts` && <NoContacts />}
        {msg === `blocked-user` && <BlockedUsersSvg />}
        {msg === `no-group` && <NoGroupSvg />}
        {msg === `voice` && <NoVoiceSvg />}
        {msg === `no-member` && <NoMemberSvg />}
      </View>
    </>
  );
};

NoDataFound.propTypes = {
  msg: PropTypes.string,
  size: PropTypes.number,
  h: PropTypes.number,
  style: PropTypes.object,
};
