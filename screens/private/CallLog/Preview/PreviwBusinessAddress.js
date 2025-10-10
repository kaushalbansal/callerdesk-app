import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';

import ModalBottom from '../../../../common/components/ModalBottom';
import {
  Address,
  BizsNameLabel,
  SendLabel,
} from '../../../../common/Constants';
import { navigateToLink } from '../../../../common/helpers/utils';
import WAConfirm from './WAConfirm';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { rh } from '../../../../common/helpers/dimentions';

const PreviewBusinessAddress = ({ data, open, onClose = () => {}, from }) => {
  const [waConfirm, setWaConfirm] = useState(false);
  const { waTempList } = useSelector((state) => state.whatsappTemplate);
  const filterWaTempUpi = waTempList.filter(
    (template) => template.wa_template_type === 'address',
  );
  // eslint-disable-next-line no-unused-vars
  const [waDataBank, setWaDataBank] = useState(filterWaTempUpi);

  const wappUrl = `https://api.whatsapp.com/send?text=
*${BizsNameLabel}* ${waDataBank[0]?.wa_template_name ? waDataBank[0]?.wa_template_name : `N/A`}
*${Address}* ${waDataBank[0]?.wa_template_content ? waDataBank[0]?.wa_template_content : `N/A`}
&phone=+91`;
  console.log(data);
  return (
    <View>
      <ModalBottom
        height="40%"
        title="Send Business Address"
        open={open}
        onClose={onClose}
      >
        <View style={styles.waPreviewContainer}>
          <View style={styles.chatArrow} />
          <View style={styles.waPreview}>
            <View style={styles.marginSet}>
              <Text style={styles.paymentText}>{BizsNameLabel} - </Text>
              <Text style={{ color: colors.primary }}>
                {waDataBank[0]?.wa_template_name
                  ? waDataBank[0]?.wa_template_name
                  : `N/A`}
              </Text>
            </View>
            <View style={[styles.marginSet, { paddingBottom: rh(1) }]}>
              <Text style={styles.paymentText}>{Address} - </Text>
              <Text style={{ color: colors.primary }}>
                {waDataBank[0]?.wa_template_content
                  ? waDataBank[0]?.wa_template_content
                  : `N/A`}
              </Text>
            </View>
          </View>
        </View>
        <Button
          // onPress={() => navigateToLink(wappUrl)}
          onPress={() => {
            if (from === `contact detail`) {
              navigateToLink(wappUrl + data);
            } else {
              // onClose();
              setWaConfirm(true);
            }
          }}
        >
          {SendLabel}
        </Button>
      </ModalBottom>
      <WAConfirm
        data={data}
        url={wappUrl}
        open={waConfirm}
        onClose={() => {
          onClose();
          setWaConfirm(false);
        }}
        from={`biz`}
        fromScreen={from}
      ></WAConfirm>
    </View>
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
  marginSet: { marginVertical: rh(0.5) },
  paymentText: { fontWeight: 'bold' },
  waPreview: {
    backgroundColor: colors.whatsappBg,
    borderRadius: 10,
    borderTopRightRadius: 0,
    flexWrap: 'wrap',
    marginLeft: 16,
    marginRight: 14,
    marginVertical: 16,
    minHeight: rh(8),
    padding: 8,
    paddingBottom: 0,
    width: '80%',
  },
  waPreviewContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.redBorder,
    borderRadius: 8,
    marginBottom: 40,
    marginTop: 8,
    minHeight: 100,
    position: 'relative',
  },
});

export default PreviewBusinessAddress;
PreviewBusinessAddress.propTypes = {
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
