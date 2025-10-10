import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { colors } from '../../../themes/vars';

import ModalBottom from '../../../common/components/ModalBottom';
import { IconTickMark } from '../../../common/icons/tickmark';
import { MyView } from '../../../common/components/MyView';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import MyText from '../../../common/components/MyText';
import {
  AccHName,
  AccHNameLabel,
  AccNo,
  AccNoLabel,
  IFSC,
  IFSCLabel,
  PaymentMessage,
  PaymentTextTitle,
  PreviewLabel,
  SwitchBank,
  SwitchUPI,
  TimeLabelText,
  UpdateLabel,
} from '../../../common/Constants';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { useDispatch, useSelector } from 'react-redux';
import {
  addWhatsAppTemplate,
  updateWhatsAppTemplate,
} from '../../../common/redux/actions/contact';
import PropTypes from 'prop-types';

const AddPaymentBank = ({
  open,
  onClose = () => {},
  switchBacktoUpi = () => {},
}) => {
  const [formData, setData] = useState({ bankSwitch: true });
  const { waTempList } = useSelector((state) => state.whatsappTemplate);
  const filterWaTemp = waTempList.filter(
    (template) => template.wa_template_type === 'bank',
  );
  // eslint-disable-next-line no-unused-vars
  const [waData, setWaData] = useState(filterWaTemp);
  const [name, setName] = useState(waData[0]?.wa_template_name);
  const [number, setNumber] = useState(waData[0]?.wa_template_content);
  const [ifsc, setIfsc] = useState(waData[0]?.wa_template_title);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.global);
  useEffect(() => {
    console.log(waData);
  });
  const addWATemplate = () => {
    if (waData.length > 0) {
      const obj = {
        wa_template_name: name,
        wa_template_content: number,
        wa_template_title: ifsc,
        wa_template_type: `bank`,
        wa_template_id: waData[0].wa_template_id,
      };
      console.log(obj, `objjjj`);
      dispatch(updateWhatsAppTemplate(user?.authcode, obj)).then(() => {
        onClose();
      });
    } else {
      const obj = {
        wa_template_name: name,
        wa_template_content: number,
        wa_template_title: ifsc,
        wa_template_type: `bank`,
      };
      console.log(obj, `objjjj`);
      dispatch(addWhatsAppTemplate(user?.authcode, obj)).then(() => {
        onClose();
      });
    }
  };
  const onSubmit = () => {
    addWATemplate();
  };
  return (
    <ModalBottom
      height="75%"
      title={PaymentMessage}
      open={open}
      onClose={onClose}
    >
      <View style={styles.row}>
        <Button
          size="tiny"
          appearance="outline"
          onPress={() => {
            setData({ ...formData, bankSwitch: !!open });
            switchBacktoUpi();
          }}
          style={styles.button}
          status={'basic'}
        >
          {SwitchUPI}
        </Button>
        <Button
          size="tiny"
          appearance="outline"
          onPress={() => setData({ ...formData, upiSwitch: true })}
          style={styles.button}
          status={'primary'}
        >
          {SwitchBank}
        </Button>
      </View>
      <View style={styles.row1}>
        <TextInputWithIcon
          value={name}
          placeholder={AccHNameLabel}
          onChangeText={(text) => setName(text)}
        ></TextInputWithIcon>
        <TextInputWithIcon
          value={number}
          placeholder={AccNo}
          onChangeText={(text) => setNumber(text)}
        ></TextInputWithIcon>
        <TextInputWithIcon
          value={ifsc}
          placeholder={IFSCLabel}
          onChangeText={(text) => setIfsc(text)}
        ></TextInputWithIcon>
      </View>
      <View style={{ marginVertical: rh(1), marginLeft: rw(3) }}>
        <Text style={{ fontSize: rf(1.4) }}>{PreviewLabel}</Text>
      </View>
      <ImageBackground
        source={require(`../../../assets/wabg.png`)}
        resizeMode="stretch"
        style={styles.waPreviewContainer}
      >
        <View style={styles.chatArrow} />
        <View style={styles.waPreview}>
          <MyText>{PaymentTextTitle}</MyText>
          {/* <MyText bold>
            {AccHNameLabel}
            <MyText color={colors.primary}>{name || AccHName}</MyText>
          </MyText> */}
          <View style={styles.marginSet}>
            <Text style={styles.paymentText}>{AccHNameLabel}</Text>
            <Text style={{ color: colors.primary }}>{name || AccHName}</Text>
          </View>
          <View style={styles.marginSet}>
            <Text style={styles.paymentText}>{AccNoLabel}</Text>
            <Text style={{ color: colors.primary }}>{number || AccNo}</Text>
          </View>
          <View style={styles.marginSet}>
            <Text style={styles.paymentText}>{IFSCLabel}</Text>
            <Text style={{ color: colors.primary }}>{ifsc || IFSC}</Text>
          </View>
          <View style={styles.time}>
            <MyText responsiveSize={1.2} hint>
              {TimeLabelText}
            </MyText>
            <IconTickMark size={12} color={colors.grey} />
          </View>
        </View>
      </ImageBackground>
      <Button onPress={onSubmit}>{UpdateLabel}</Button>
      <MyView mb={rh(1)}></MyView>
    </ModalBottom>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: colors.white, borderRadius: 15 },
  marginSet: { marginVertical: rh(0.5) },
  paymentText: { fontWeight: 'bold' },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: rh(1),
  },
  row1: { marginTop: 10 },
  time: {
    bottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 4,
    width: '100%',
  },
  waPreview: {
    backgroundColor: colors.whatsappBg,
    borderRadius: 10,
    borderTopRightRadius: 0,
    marginLeft: 16,
    marginRight: 14,
    marginVertical: 16,
    minHeight: 80,
    padding: 8,
    width: '80%',
  },
  waPreviewContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.redBorder,
    borderRadius: 8,
    marginBottom: rh(2),
    marginTop: 8,
    minHeight: 100,
    position: 'relative',
  },
});

export default AddPaymentBank;
AddPaymentBank.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  switchBacktoUpi: PropTypes.func,
};
