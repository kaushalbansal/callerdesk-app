import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { colors } from '../../../themes/vars';

import ModalBottom from '../../../common/components/ModalBottom';
import AddPaymentBank from './AddPaymentBank';
import { MyView } from '../../../common/components/MyView';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import {
  PaymentLinkLabel,
  PaymentMessage,
  PaymentTextTitle,
  PreviewLabel,
  SwitchBank,
  SwitchUPI,
  UPIMessage,
  UpdateLabel,
} from '../../../common/Constants';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const AddPaymentUPI = ({ data, open, onClose = () => {}, addWATemplate }) => {
  const [formData, setData] = useState({ upiSwitch: false, upiid: '' });
  const [err, setErr] = useState({ upiid: '' });
  const { waTempList } = useSelector((state) => state.whatsappTemplate);
  const [upiLink, setUpiLink] = useState(waTempList[0]?.wa_template_content);

  const onSubmit = () => {
    if (validate(formData)) {
      if (waTempList[0]) {
        const objSend = {
          wa_template_name: `upi`,
          wa_template_content: `${upiLink}`,
          wa_template_type: `upi`,
          wa_template_id: waTempList[0].wa_template_id,
        };
        addWATemplate(objSend);
      } else {
        const objSend = {
          wa_template_name: `upi`,
          wa_template_content: `${upiLink}`,
          wa_template_type: `upi`,
        };
        addWATemplate(objSend);
      }
    }
  };
  const validate = (vals) => {
    if (!vals.upiid) {
      setErr({ upiid: UPIMessage });
      return false;
    }
    setErr({ upiid: '' });
    return true;
  };

  return (
    <>
      <AddPaymentBank
        addWATemplate={addWATemplate}
        data={data}
        open={formData.upiSwitch}
        onClose={() => {
          setData({ ...formData, upiSwitch: false });
          onClose();
        }}
        switchBacktoUpi={() => setData({ ...formData, upiSwitch: false })}
      />

      <ModalBottom
        height="55%"
        title={PaymentMessage}
        open={open && !formData.upiSwitch}
        onClose={onClose}
      >
        <View style={styles.switchUPIStyle}>
          <Button
            size="tiny"
            appearance="outline"
            onPress={() => setData({ ...formData, upiSwitch: false })}
            style={styles.button}
            status={'primary'}
          >
            {SwitchUPI}
          </Button>
          <Button
            size="tiny"
            appearance="outline"
            onPress={() => setData({ ...formData, upiSwitch: true })}
            style={styles.button}
            status={'basic'}
          >
            {SwitchBank}
          </Button>
        </View>
        <View style={styles.textInputStyle}>
          <TextInputWithIcon
            placeholder={upiLink}
            value={upiLink}
            onChangeText={(text) => {
              setUpiLink(text);
              validate({ ...formData, upiid: text });
              setData({ ...formData, upiid: text });
            }}
          ></TextInputWithIcon>
          {err.upiid && (
            <Text style={styles.errorStyle} appearance="hint" status="danger">
              {err.upiid || ''}
            </Text>
          )}
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
            <Text>{PaymentTextTitle}</Text>
            <View style={styles.marginSet}>
              <Text style={styles.paymentText}>{PaymentLinkLabel}</Text>
              <Text style={{ color: colors.primary }}>{upiLink || ' '}</Text>
            </View>
          </View>
        </ImageBackground>
        <Button onPress={onSubmit}>{UpdateLabel}</Button>
        <MyView mb={rh(1)}></MyView>
      </ModalBottom>
    </>
  );
};
AddPaymentUPI.propTypes = {
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
  addWATemplate: PropTypes.func,
};
const styles = StyleSheet.create({
  button: { backgroundColor: colors.white, borderRadius: 15 },
  chatArrow: {
    borderColor: `transparent`,
    borderLeftWidth: 20,
    borderTopColor: colors.whatsappBg,
    borderTopWidth: 20,
    height: 0,
    position: 'absolute',
    right: 4,
    top: 16,
    transform: [{ rotate: '270deg' }],
    width: 0,
  },
  marginSet: { marginVertical: rh(0.5) },
  paymentText: { fontWeight: 'bold' },
  switchUPIStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: rh(1),
  },
  textInputStyle: { marginTop: 10 },
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
    borderRadius: 8,
    marginBottom: rh(2),
    marginTop: 8,
    minHeight: 100,
    position: 'relative',
  },
});

export default AddPaymentUPI;
