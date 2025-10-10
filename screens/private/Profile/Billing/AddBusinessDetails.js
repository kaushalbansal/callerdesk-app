/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text, Select, SelectItem } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';

import ModalBottom from '../../../../common/components/ModalBottom';
import TextArea from '../../../../common/components/TextArea';
import { MyView } from '../../../../common/components/MyView';
import { rh, rw } from '../../../../common/helpers/dimentions';
import {
  AddBusinnessDetailLabel,
  BizAddressLabel,
  BizNameLabel,
  GSTExampleLabel,
  GstNum,
  InvoiceGenerationLabel,
  NoGst,
  PinCodeLabel,
  StateLabel,
  StateList,
  UpdateLabel,
} from '../../../../common/Constants';
import TextInputWithIcon from '../../../../common/components/textinputwithicon';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CustomSwitch from '../../../../common/components/switch';
import { UpdateProfile } from '../../../../common/redux/actions/global';
import { IconArrowDown } from '../../../../common/icons/iconarrowdown';
import { toastShow } from '../../../../common/helpers/utils';

const AddBusinessDetails = ({ open, onClose = () => {} }) => {
  const { waTempList } = useSelector((state) => state.whatsappTemplate);
  const filterWaTemp = waTempList.filter(
    (template) => template?.wa_template_type === 'address',
  );
  const { profile, loading } = useSelector((state) => state?.global);

  // eslint-disable-next-line no-unused-vars
  const [waData, setWaData] = useState(filterWaTemp);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.global);

  const defaultObj = {
    businessName: profile?.login_account?.company_name
      ? profile?.login_account?.company_name
      : ``,
    address: profile?.login_account?.company_address
      ? profile?.login_account?.company_address
      : ``,
    loaction: profile?.login_account?.company_name
      ? profile?.login_account?.company_name
      : ``,
    pinCode: profile?.login_account?.pincode
      ? profile?.login_account?.pincode
      : ``,
    state: profile?.login_account?.state ? profile?.login_account?.state : ``,
    gstNo: profile?.login_account?.gst_no ? profile?.login_account?.gst_no : ``,
  };
  const defaultObjErr = { businessName: '', address: '', loaction: '' };
  // eslint-disable-next-line no-unused-vars
  const [err, setErr] = useState({ ...defaultObjErr });
  const [data, setData] = useState({ ...defaultObj });

  const updateApi = () => {
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    const pinCodeRegex = /^(\d{4}|\d{6})$/;

    const gstNoValid = gstRegex.test(data?.gstNo.trim());
    const pinCodeValid = pinCodeRegex.test(data?.pinCode);
    if (!showMessageModal && !gstNoValid) {
      toastShow(`Please enter a valid GST Number`);
      return;
    }
    if (!pinCodeValid) {
      toastShow(`Please enter a valid Pincode`);
      return;
    }
    dispatch(
      UpdateProfile(
        user?.authcode,
        data,
        () => {
          onClose();
        },
        showMessageModal,
      ),
    );
  };

  return (
    <ModalBottom
      height="75%"
      title={AddBusinnessDetailLabel}
      open={open}
      onClose={onClose}
    >
      <Text style={styles.reportsLabel}>{InvoiceGenerationLabel}</Text>
      <View
        style={{
          flexDirection: `row`,
          alignItems: `center`,
          justifyContent: `space-between`,
          width: rw(30),
          alignSelf: `flex-end`,
          marginTop: rh(1),
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: colors.callGroupIcon,
            fontWeight: `900`,
          }}
        >
          {NoGst}
        </Text>
        <CustomSwitch
          checked={showMessageModal}
          size="small"
          onChange={() => setShowMessageModal(!showMessageModal)}
        />
      </View>
      {showMessageModal ? (
        <View style={{ marginTop: rh(1) }}>
          <TextInputWithIcon
            from={`contact`}
            placeholder={BizNameLabel}
            onChangeText={(val) => {
              setData({ ...data, businessName: val });
            }}
            value={data.businessName}
          ></TextInputWithIcon>
          {err.businessName && (
            <Text style={styles.err} appearance="hint" status="danger">
              {err.businessName || ''}
            </Text>
          )}
          <TextArea
            from={`contact`}
            placeholder={BizAddressLabel}
            value={data.address}
            error={err.address.length > 0}
            onChange={(val) => {
              setData({ ...data, address: val });
              //   validate({ ...data, address: val.trim() }, 'address');
            }}
            style={{ width: rw(86) }}
          />
          {err.address && (
            <Text style={styles.err} appearance="hint" status="danger">
              {err.address || ''}
            </Text>
          )}
          <Select
            selectedIndex={0}
            placeholder={data.state ? data.state : StateLabel}
            status={err.address ? 'danger' : 'basic'}
            value={[...StateList][data.state - 1]?.label || ''}
            onSelect={(idx) => {
              console.log(`idx???`, idx?.row);
              console.log(`idx???`, [...StateList][idx?.row]?.label);
              setData({ ...data, state: [...StateList][idx?.row]?.label });
            }}
            accessoryRight={<IconArrowDown size={14} />}
            style={{ marginVertical: rh(1) }}
          >
            {[...StateList].map((x, i) => (
              <SelectItem
                selected={data.state === i + 1}
                key={x.id}
                title={x.label}
              />
            ))}
          </Select>
          <TextInputWithIcon
            from={`contact`}
            placeholder={PinCodeLabel}
            inputMode="number-pad"
            onChangeText={(val) => {
              setData({ ...data, pinCode: val });
            }}
            value={data.pinCode}
          ></TextInputWithIcon>
        </View>
      ) : (
        <View style={{ marginTop: rh(1) }}>
          <TextInputWithIcon
            from={`contact`}
            placeholder={BizNameLabel}
            onChangeText={(val) => {
              setData({ ...data, businessName: val });
            }}
            value={data.businessName}
          ></TextInputWithIcon>
          {err.businessName && (
            <Text style={styles.err} appearance="hint" status="danger">
              {err.businessName || ''}
            </Text>
          )}
          <TextArea
            from={`contact`}
            placeholder={BizAddressLabel}
            value={data.address}
            error={err.address.length > 0}
            onChange={(val) => {
              setData({ ...data, address: val });
              //   validate({ ...data, address: val.trim() }, 'address');
            }}
            style={{ width: rw(86), marginBottom: rh(1.5) }}
          />
          {err.address && (
            <Text style={styles.err} appearance="hint" status="danger">
              {err.address || ''}
            </Text>
          )}
          <Select
            selectedIndex={0}
            placeholder={data.state ? data.state : StateLabel}
            status={err.address ? 'danger' : 'basic'}
            value={[...StateList][data.state - 1]?.label || ''}
            onSelect={(idx) => {
              console.log(`idx???`, idx?.row);
              console.log(`idx???`, [...StateList][idx?.row]?.label);
              setData({ ...data, state: [...StateList][idx?.row]?.label });
            }}
            accessoryRight={<IconArrowDown size={14} />}
            style={{ marginBottom: rh(1) }}
          >
            {[...StateList].map((x, i) => (
              <SelectItem
                selected={data.state === i + 1}
                key={x.id}
                title={x.label}
              />
            ))}
          </Select>
          <TextInputWithIcon
            from={`contact`}
            placeholder={PinCodeLabel}
            inputMode="number-pad"
            onChangeText={(val) => {
              setData({ ...data, pinCode: val });
            }}
            value={data.pinCode}
          ></TextInputWithIcon>
          <TextInputWithIcon
            from={`contact`}
            placeholder={GstNum}
            onChangeText={(val) => {
              setData({ ...data, gstNo: val });
            }}
            value={data.gstNo}
          ></TextInputWithIcon>
          <Text
            style={[
              styles.currentPlanText,
              {
                fontSize: 11,
                color: colors.greyColorNew,
                fontWeight: `600`,
                marginLeft: rw(0.5),
              },
            ]}
          >
            {GSTExampleLabel}
          </Text>
        </View>
      )}
      {!loading ? (
        <Button
          style={{ marginTop: rh(2) }}
          onPress={() => {
            updateApi();
          }}
        >
          {UpdateLabel}
        </Button>
      ) : (
        <Button>
          <ActivityIndicator color={colors.white} size={20} />
        </Button>
      )}
      <MyView mb={rh(1)}></MyView>
    </ModalBottom>
  );
};

const styles = StyleSheet.create({
  currentPlanText: {
    color: colors.callGroupIcon,
    fontSize: 10,
    fontWeight: `900`,
  },
  err: { opacity: 1 },
  reportsLabel: {
    color: colors.greyColorNew,
    fontSize: 12,
    fontWeight: `800`,
  },
});

export default AddBusinessDetails;
AddBusinessDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  switchBacktoUpi: PropTypes.func,
};
