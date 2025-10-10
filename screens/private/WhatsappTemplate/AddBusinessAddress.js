/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

import { colors } from '../../../themes/vars';

import ModalBottom from '../../../common/components/ModalBottom';
import TextArea from '../../../common/components/TextArea';
import { MyView } from '../../../common/components/MyView';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import {
  Address,
  AddressAdd,
  AddressAddReq,
  BizEnterNameReqLabel,
  BizsNameLabel,
  PreviewLabel,
  UpdateLabel,
} from '../../../common/Constants';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { useDispatch, useSelector } from 'react-redux';
import {
  addWhatsAppTemplate,
  updateWhatsAppTemplate,
} from '../../../common/redux/actions/contact';
import PropTypes from 'prop-types';

const AddBusinessAddress = ({ open, onClose = () => {} }) => {
  const { waTempList } = useSelector((state) => state.whatsappTemplate);
  const filterWaTemp = waTempList.filter(
    (template) => template?.wa_template_type === 'address',
  );
  // eslint-disable-next-line no-unused-vars
  const [waData, setWaData] = useState(filterWaTemp);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.global);
  const defaultObj = {
    businessName: waData[0]?.wa_template_name
      ? waData[0]?.wa_template_name
      : ``,
    address: waData[0]?.wa_template_content
      ? waData[0]?.wa_template_content
      : ``,
    loaction: waData[0]?.wa_template_title ? waData[0]?.wa_template_title : ``,
  };
  const defaultObjErr = { businessName: '', address: '', loaction: '' };
  const [err, setErr] = useState({ ...defaultObjErr });
  const [data, setData] = useState({ ...defaultObj });
  const addWATemplate = () => {
    if (waData.length > 0) {
      const obj = {
        wa_template_name: data?.businessName,
        wa_template_content: data?.address,
        wa_template_title: data?.loaction,
        wa_template_type: `address`,
        wa_template_id: waData[0].wa_template_id,
      };
      console.log(obj, `objjjj`);
      dispatch(updateWhatsAppTemplate(user?.authcode, obj)).then(() => {
        onClose();
      });
    } else {
      const obj = {
        wa_template_name: data?.businessName,
        wa_template_content: data?.address,
        wa_template_title: data?.loaction,
        wa_template_type: `address`,
      };
      console.log(obj, `objjjj`);
      dispatch(addWhatsAppTemplate(user?.authcode, obj)).then(() => {
        onClose();
      });
    }
  };
  const onSubmit = () => {
    console.log(data);
    validate(data);
    if (
      data.address.length !== 0 &&
      data.businessName.length !== 0 &&
      data.loaction.length !== 0
    ) {
      addWATemplate();
    }
  };

  const validate = (vals, key) => {
    const msg = {
      businessName: BizEnterNameReqLabel,
      address: AddressAddReq,
      loaction: 'Please enter location.',
    };
    const er = { ...err };
    if (!key) {
      er.businessName = vals.businessName ? '' : msg.businessName;
      er.address = vals.address ? '' : msg.address;
      er.loaction = vals.loaction ? '' : msg.loaction;
    } else {
      er[key] = vals[key] ? '' : msg[key];
    }
    setErr({ ...er });
    console.log(`errr`, err);
  };

  return (
    <ModalBottom height="75%" title={AddressAdd} open={open} onClose={onClose}>
      <MyView mt={rw(3)}>
        <TextInputWithIcon
          placeholder={BizsNameLabel}
          onChangeText={(val) => {
            setData({ ...data, businessName: val });
            validate({ ...data, businessName: val.trim() }, 'businessName');
          }}
          value={data.businessName}
        ></TextInputWithIcon>
        {err.businessName && (
          <Text style={styles.err} appearance="hint" status="danger">
            {err.businessName || ''}
          </Text>
        )}
      </MyView>
      <TextArea
        placeholder={Address}
        value={data.address}
        error={err.address.length > 0}
        onChange={(val) => {
          setData({ ...data, address: val });
          validate({ ...data, address: val.trim() }, 'address');
        }}
        style={{ width: rw(86) }}
      />
      {err.address && (
        <Text style={styles.err} appearance="hint" status="danger">
          {err.address || ''}
        </Text>
      )}
      {/* <TextInputWithIcon
        placeholder={gettingLocation ? PleaseWait : AddMapDir}
        onChangeText={(val) => {
          setData({ ...data, loaction: val });
          validate({ ...data, loaction: val.trim() }, 'loaction');
        }}
        value={gettingLocation ? '' : data.loaction}
        icon={
          <MyLink
            fs={rf(1.3)}
            linkText={CurrLocationLabel}
            onPress={getLocation}
          />
        }
      ></TextInputWithIcon> */}
      {err.loaction && (
        <Text style={styles.err} appearance="hint" status="danger">
          {err.loaction || ''}
        </Text>
      )}
      <View style={{ marginVertical: rh(1), marginLeft: rw(1) }}>
        <Text style={{ fontSize: rf(1.4) }}>{PreviewLabel}</Text>
      </View>
      <ImageBackground
        source={require(`../../../assets/wabg.png`)}
        resizeMode="stretch"
        style={styles.waPreviewContainer}
      >
        <View style={styles.chatArrow} />
        <View style={styles.waPreview}>
          <View style={styles.marginSet}>
            <Text style={styles.paymentText}>{BizsNameLabel} -</Text>
            <Text style={{ color: colors.primary }}>
              {data.businessName || 'NA'}
            </Text>
          </View>
          <View style={styles.marginSet}>
            <Text style={styles.paymentText}>{Address} -</Text>
            <Text style={{ color: colors.primary }}>
              {data.address || 'NA'}
            </Text>
          </View>
        </View>
      </ImageBackground>
      <Button onPress={onSubmit}>{UpdateLabel}</Button>
      <MyView mb={rh(1)}></MyView>
    </ModalBottom>
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
  err: { opacity: 1 },
  marginSet: { marginVertical: rh(0.5) },
  paymentText: { fontWeight: 'bold' },
  waPreview: {
    backgroundColor: colors.whatsappBg,
    borderRadius: 10,
    borderTopRightRadius: 0,
    marginLeft: 16,
    marginRight: 14,
    marginVertical: 16,
    minHeight: 80,
    padding: 8,
    width: '85%',
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

export default AddBusinessAddress;
AddBusinessAddress.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  switchBacktoUpi: PropTypes.func,
};
