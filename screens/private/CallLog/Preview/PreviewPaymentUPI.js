import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';

import ModalBottom from '../../../../common/components/ModalBottom';
import CustomSwitch from '../../../../common/components/switch';
import { IconTickMark } from '../../../../common/icons/tickmark';
import PreviwPaymentBank from './PreviwPaymentBank';
import {
  PaymentLink,
  PaymentLinkLabel,
  PaymentText,
  PaymentTextTitle,
  PaymentTime,
  SendLabel,
} from '../../../../common/Constants';
import PropTypes from 'prop-types';

const PreviwPaymentUPI = ({ data, open, onClose = () => {} }) => {
  const [formData, setData] = useState({ upiSwitch: false });

  return (
    <>
      <PreviwPaymentBank
        data={data}
        open={formData.upiSwitch}
        onClose={() => {
          setData({ ...formData, upiSwitch: false });
          onClose();
        }}
        switchBacktoUpi={() => setData({ ...formData, upiSwitch: false })}
      />
      <ModalBottom
        height="45%"
        title={PaymentText}
        open={open && !formData.upiSwitch}
        onClose={onClose}
      >
        <View style={styles.view}>
          <Text>UPI ID</Text>
          <CustomSwitch
            onChange={(checked) => setData({ ...formData, upiSwitch: checked })}
            checked={formData.upiSwitch}
          />
        </View>
        <View style={styles.waPreviewContainer}>
          <View style={styles.chatArrow} />
          <View style={styles.waPreview}>
            <Text>{PaymentTextTitle}</Text>
            <View style={styles.view1}>
              <Text style={styles.text}>{PaymentLinkLabel}</Text>
              <Text style={{ color: colors.primary }}>{PaymentLink}</Text>
            </View>
            <View style={styles.paymentView}>
              <Text appearance="hint" style={styles.paymentText}>
                {PaymentTime}
              </Text>
              <IconTickMark size={12} color={colors.grey} />
            </View>
          </View>
        </View>
        <Button>{SendLabel}</Button>
      </ModalBottom>
    </>
  );
};

const styles = StyleSheet.create({
  chatArrow: {
    borderColor: colors.transparent,
    borderLeftColor: colors.transparent,
    borderLeftWidth: 20, // Adjust the size of the arrow as needed
    borderTopColor: colors.whatsappBg, // Match the container background color
    borderTopWidth: 20, // Adjust the size of the arrow as needed
    height: 0,
    position: 'absolute',
    right: 4,
    top: 16,
    transform: [{ rotate: '270deg' }],
    width: 0,
  },
  paymentText: { fontSize: 10 },
  paymentView: {
    bottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 4,
    width: '100%',
  },
  text: { fontWeight: 'bold' },
  view: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  view1: { flexDirection: 'row' },
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
    marginBottom: 40,
    marginTop: 16,
    minHeight: 100,
    position: 'relative',
  },
});

export default PreviwPaymentUPI;
PreviwPaymentUPI.propTypes = {
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
  from: PropTypes.string,
  onClose: PropTypes.func,
};
