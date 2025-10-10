import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';

import ModalBottom from '../../../../common/components/ModalBottom';
import {
  AccHNameLabel,
  AccNoLabel,
  IFSCLabel,
  PaymentLink,
  PaymentLinkLabel,
  PaymentText,
  PaymentTextTitle,
  SendLabel,
  SwitchBank,
  SwitchUPI,
} from '../../../../common/Constants';
import WAConfirm from './WAConfirm';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { rh } from '../../../../common/helpers/dimentions';

const PreviewPayment = ({ from, open, onClose = () => {}, data }) => {
  const [formData, setData] = useState({ view: 'upi' });
  const [waConfirm, setWaConfirm] = useState(false);
  const { waTempList } = useSelector((state) => state.whatsappTemplate);
  const filterWaTempUpi = waTempList.filter(
    (template) => template.wa_template_type === 'upi',
  );
  const filterWaTempBank = waTempList.filter(
    (template) => template.wa_template_type === 'bank',
  );
  // eslint-disable-next-line no-unused-vars
  const [waDataBank, setWaDataBank] = useState(filterWaTempBank);
  // eslint-disable-next-line no-unused-vars
  const [waDataUpi, setWaDataUpi] = useState(filterWaTempUpi);

  const wappUrl =
    formData.view === 'upi'
      ? `https://api.whatsapp.com/send?text=${PaymentTextTitle} 

*${PaymentLinkLabel}* ${
          waDataUpi[0]?.wa_template_content
            ? waDataUpi[0]?.wa_template_content
            : PaymentLink
        }&phone=+91`
      : `https://api.whatsapp.com/send?text=${PaymentTextTitle} 

*${AccHNameLabel}* ${waDataBank[0]?.wa_template_name}
*${AccNoLabel}* ${waDataBank[0]?.wa_template_content}
*${IFSCLabel}* ${waDataBank[0]?.wa_template_title}&phone=+91`;
  return (
    <View>
      <ModalBottom
        height="45%"
        title={PaymentText}
        open={open}
        onClose={onClose}
      >
        <View style={styles.container}>
          <Button
            size="tiny"
            appearance="outline"
            // appearance={formData.view == 'bank' ? 'ghost' : 'outline'}
            onPress={() => setData({ ...formData, view: 'upi' })}
            style={styles.buttonStyle}
            status={formData.view === 'bank' ? 'basic' : 'primary'}
          >
            {SwitchUPI}
          </Button>

          <Button
            size="tiny"
            appearance="outline"
            // appearance={formData.view == 'upi' ? 'ghost' : 'outline'}
            onPress={() => setData({ ...formData, view: 'bank' })}
            style={styles.buttonStyle}
            status={formData.view === 'upi' ? 'basic' : 'primary'}
          >
            {SwitchBank}
          </Button>
        </View>

        {formData.view === 'bank' && (
          <View style={styles.waPreviewContainer}>
            <View style={styles.chatArrow} />
            <View style={styles.waPreview}>
              <Text>{PaymentTextTitle}</Text>
              <View style={styles.marginSet}>
                <Text style={styles.paymentText}>{AccHNameLabel}</Text>
                <Text style={{ color: colors.primary }}>
                  {waDataBank[0]?.wa_template_name
                    ? waDataBank[0]?.wa_template_name
                    : `N/A`}
                </Text>
              </View>
              <View style={styles.marginSet}>
                <Text style={styles.paymentText}>{AccNoLabel}</Text>
                <Text style={{ color: colors.primary }}>
                  {waDataBank[0]?.wa_template_content
                    ? waDataBank[0]?.wa_template_content
                    : `N/A`}
                </Text>
              </View>
              <View style={styles.marginSet}>
                <Text style={styles.paymentText}>{IFSCLabel}</Text>
                <Text style={{ color: colors.primary }}>
                  {waDataBank[0]?.wa_template_title
                    ? waDataBank[0]?.wa_template_title
                    : `N/A`}
                </Text>
              </View>
            </View>
          </View>
        )}
        {formData.view === 'upi' && (
          <View style={styles.waPreviewContainer}>
            <View style={styles.chatArrow} />
            <View style={styles.waPreview}>
              <Text>{PaymentTextTitle}</Text>
              <View style={styles.marginSet}>
                <Text style={styles.paymentText}>{PaymentLinkLabel}</Text>
                <Text style={{ color: colors.primary }}>
                  {waTempList[0]?.wa_template_content}
                </Text>
              </View>
            </View>
          </View>
        )}
        <Button
          onPress={() => {
            // onClose();
            setWaConfirm(true);
          }}
        >
          {SendLabel}
        </Button>
      </ModalBottom>
      {waConfirm && (
        <WAConfirm
          data={data}
          url={wappUrl}
          open={waConfirm}
          onClose={() => {
            onClose();
            setWaConfirm(false);
          }}
          from={`payment`}
          fromScreen={from}
        ></WAConfirm>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: { backgroundColor: colors.white, borderRadius: 15 },
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
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  marginSet: { marginVertical: rh(0.5) },
  paymentText: { fontWeight: 'bold' },
  waPreview: {
    backgroundColor: colors.whatsappBg,
    borderRadius: 10,
    borderTopRightRadius: 0,
    marginLeft: 16,
    marginRight: 14,
    marginVertical: 16,
    minHeight: 100,
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

export default PreviewPayment;
PreviewPayment.propTypes = {
  data: PropTypes.shape({
   type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
