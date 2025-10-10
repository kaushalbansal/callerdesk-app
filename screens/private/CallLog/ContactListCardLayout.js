import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { formatTotalTime } from '../../../common/helpers/utils';
import { colors } from '../../../themes/vars';
import { IconOutGoing } from '../../../common/icons/iconoutgoing';
import { IconIncoming } from '../../../common/icons/iconincoming';
import { IconHistory } from '../../../common/icons/wcallhistory';
import { IconDownload } from '../../../common/icons/download';
import { IconRouting } from '../../../common/icons/iconrouting';
import { IconBlock } from '../../../common/icons/blockuser';
import CallLogPlayer from './CallLogPlayer';
import ModalBottom from '../../../common/components/ModalBottom';
import BlockUser from './BlockUser';
import Editcontact from './EditContact';
import { clearRoutingList } from '../../../common/redux/actions/callLog';
import CallDownload from './CallDownload';
import PreviewBusinessAddress from './Preview/PreviwBusinessAddress';
import PreviewPayment from './Preview/PreviewPayment';
import { CallIcon } from '../../../common/icons/calliconnew1';
import { RedirectText, RedirectTextTitle } from '../../../common/Constants';
import PropTypes from 'prop-types';

const ContactListCardLayout = ({
  data,
  playerId,
  setPlayerId,
  bg,
  reloadCallLog = () => {},
}) => {
  const _defaultModal = {
    whatsapp: false,
    blockUser: false,
    paymentUpi: false,
    businessAddress: false,
    editContact: false,
    fileDownload: false,
  };

  const [modals, setModals] = useState(_defaultModal);
  const callDuration = useMemo(() => formatTotalTime(+data.talk_duration));
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const num =
    data.contact_num[0] === '0'
      ? `+91 ${data.contact_num.substring(1, data.contact_num.length)}`
      : data.contact_num;
  const wappUrl = `https://api.whatsapp.com/send?phone=+91${num}&text= `;

  const closeModal = () => setModals({ ..._defaultModal });

  return (
    <View style={cardStyle.container}>
      <BlockUser data={data} open={modals.blockUser} onClose={closeModal} />
      {
        <PreviewPayment
          data={data}
          open={modals.paymentUpi}
          onClose={closeModal}
        />
      }

      {modals.businessAddress && (
        <PreviewBusinessAddress
          data={data}
          open={modals.businessAddress}
          onClose={closeModal}
        />
      )}

      {modals.editContact && (
        <Editcontact
          from="list"
          data={data}
          open={modals.editContact}
          onClose={() => {
            closeModal();
          }}
        />
      )}
      {modals.fileDownload && data.file && (
        <CallDownload
          data={data}
          open={modals.fileDownload}
          onClose={closeModal}
        />
      )}
      <ModalBottom
        height="24%"
        title={RedirectTextTitle}
        open={modals.whatsapp}
        onClose={closeModal}
      >
        <View style={cardStyle.content}>
          <Text style={cardStyle.content1}>{RedirectText}</Text>
          <TouchableOpacity
          // onPress={() => navigateToLink(wappUrl)}
          >
            <Text style={cardStyle.wapText}>{wappUrl}</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <View style={[cardStyle.leftBox, {}]}>
        <View style={[cardStyle.circle, { backgroundColor: bg }]}>
          <Text style={cardStyle.memberText}>
            {data.member_name ? data.member_name[0].toLocaleUpperCase() : 'NA'}
          </Text>
        </View>
      </View>
      <View style={cardStyle.rightBox}>
        <View style={cardStyle.memberText1}>
          <View style={cardStyle.fstRowLeft}>
            <Text>{data.member_name || 'NA'}</Text>
          </View>
          <View style={cardStyle.fstRowRight}>
            {data.callstatus === 'ANSWER' ? (
              <IconOutGoing size={12} color={colors.black} />
            ) : (
              <IconIncoming size={12} color={colors.black} />
            )}
          </View>
        </View>
        {/* <View style={{ }}> */}
        <View style={cardStyle.secRowLeft}>
          <CallLogPlayer
            id={data.id}
            setPlayerId={setPlayerId}
            currentPlayingId={playerId}
            callDuration={callDuration}
            url={data.file}
          />
        </View>
        <View style={cardStyle.buttonView}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CallHistory', { caller: data.caller_num });
            }}
          >
            <IconHistory />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModals({ ..._defaultModal, fileDownload: true })}
          >
            <IconDownload />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CallRouting', {
                data: { sid_id: data.sid_id },
              });
              dispatch(clearRoutingList());
            }}
          >
            <IconRouting />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModals({ ..._defaultModal, blockUser: true })}
          >
            <IconBlock />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModals({ ..._defaultModal, editContact: true })}
          >
            <CallIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const cirleDim = 50;
const cardH = cirleDim + 15;

const cardStyle = StyleSheet.create({
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: `5%`,
  },
  container: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: `#FEF1F1`,
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    height: `91.5%`,
    justifyContent: 'center',
    marginLeft: `2%`,
    marginVertical: `2%`,
    paddingHorizontal: `3%`,
    width: `97%`,
  },
  content: { alignItems: 'center', gap: 10, justifyContent: 'center' },
  content1: { fontSize: 20, textAlign: 'center' },
  fstRowLeft: {
    width: '50%',
  },
  fstRowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '50%',
  },
  leftBox: {
    flexDirection: 'row',
    height: cardH,
    width: '15%',
  },
  memberText: { color: colors.white, fontSize: 20 },
  memberText1: { flexDirection: 'row' },
  rightBox: {
    flexDirection: 'column',
    height: cardH,
    justifyContent: 'space-between',
    paddingLeft: 8,
    width: '85%',
  },
  secRowLeft: {
    flexDirection: 'row',
    marginTop: `5%`,
    width: '100%',
  },
  wapText: {
    color: colors.primary,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ContactListCardLayout;
ContactListCardLayout.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    talk_duration: PropTypes.number,
    type: PropTypes.string,
    caller_num: PropTypes.string,
    callstatus: PropTypes.string,
    callresult: PropTypes.string,
    sid_id: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    enddatetime: PropTypes.string,
    startdatetime: PropTypes.string,
    caller_name: PropTypes.string,
    contact_num: PropTypes.string,
    created_at: PropTypes.string,
  }),
  setPlayerId: PropTypes.func,
  playerId: PropTypes.number,
  index: PropTypes.number,
  reloadCallLog: PropTypes.func,
  bg: PropTypes.string,
};
