import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '../../../common/components/CustomHeader';
import { WhatsappTemplateBanner } from '../../../common/icons/whatsapptemp';
import { QRIcon } from '../../../common/icons/qr';
import { Directn, LocationSvg } from '../../../common/icons/directn';
import { colors } from '../../../themes/vars';
import CustomIcon from '../../../common/components/CustomIcon';
import AddBusinessAddress from './AddBusinessAddress';
import AddPaymentUPI from './AddPaymentUPI';
import { MyView, FlexView } from '../../../common/components/MyView';
import { rw, rh } from '../../../common/helpers/dimentions';
import MyText from '../../../common/components/MyText';
import {
  AddUPIBank,
  AddressAdd,
  AddressAddDir,
  PaymentMessage,
  WATempLabel,
} from '../../../common/Constants';

import { useSelector, useDispatch } from 'react-redux';
import {
  addWhatsAppTemplate,
  updateWhatsAppTemplate,
} from '../../../common/redux/actions/contact';

const Chat = () => {
  const [modals, setModal] = useState({
    upi: false,
    bank: false,
    address: false,
  });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.global);
  const { waTempList } = useSelector((state) => state?.whatsappTemplate);

  const addWATemplate = (obj) => {
    if (waTempList?.length > 0) {
      dispatch(updateWhatsAppTemplate(user?.authcode, obj)).then(() => {
        setModal({ ...modals, upi: false });
      });
    } else {
      dispatch(addWhatsAppTemplate(user?.authcode, obj)).then(() => {
        setModal({ ...modals, upi: false });
      });
    }
  };
  return (
    <View style={styles.container}>
      <CustomHeader title={WATempLabel} />
      <AddBusinessAddress
        addWATemplate={addWATemplate}
        open={modals.address}
        onClose={() => setModal({ ...modals, address: false })}
      />
      {/* <AddPaymentBank 
       addWATemplate={addWATemplate}
       open={modals.bank}
       onClose={() => setModal({ ...modals, bank: false })}
      /> */}
      <AddPaymentUPI
        addWATemplate={addWATemplate}
        open={modals.upi}
        onClose={() => setModal({ ...modals, upi: false })}
      />
      <View style={styles.bannerStyle}>
        <MyView mb={rw(6)} mt={rw(4)}>
          <WhatsappTemplateBanner size={rh(25)} />
        </MyView>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModal({ ...modals, upi: true })}
        >
          <FlexView
            style={{ width: rw(95) }}
            bg={colors.primary}
            card
            radious={8}
            minH={rh(9)}
          >
            <MyView w={'80%'} p={rw(2.5)} pl={rw(4)}>
              <MyText color={colors.white} type="heading">
                {PaymentMessage}
              </MyText>
              <MyText color={colors.white} responsiveSize={1.5}>
                {AddUPIBank}
              </MyText>
            </MyView>
            <FlexView w={'20%'} bg="transparent" type="right" pr={rw(3)}>
              <CustomIcon svgData={QRIcon} />
            </FlexView>
          </FlexView>
        </TouchableOpacity>
        <MyView mt={rh(2)}></MyView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModal({ ...modals, address: true })}
        >
          <FlexView style={styles.addressStyle} card radious={8} minH={rh(9)}>
            <MyView w={'80%'} p={rw(2.5)} pl={rw(4)}>
              <MyText type="heading">{AddressAdd}</MyText>
              <MyText responsiveSize={1.5}>{AddressAddDir}</MyText>
            </MyView>
            <FlexView w={'20%'} bg="transparent" type="right" pr={rw(3)}>
              <CustomIcon svgData={Directn} />
              <MyView style={styles.locationStyle}>
                <CustomIcon svgData={LocationSvg} />
              </MyView>
            </FlexView>
          </FlexView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  addressStyle: { borderColor: `#EDDDDD`, borderWidth: 1, width: rw(95) },
  bannerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rw(3.5),
    width: '100%',
  },
  container: { backgroundColor: colors.white, flex: 1 },
  locationStyle: {
    bottom: 0,
    height: rh(1.4),
    position: 'absolute',
    right: rw(4),
    width: rw(2),
  },
});
