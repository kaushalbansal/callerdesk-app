import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';

import ModalBottom from '../../../common/components/ModalBottom';
import { UserAvatar } from '../../../common/icons/useravatar';
import { IconBuilding } from '../../../common/icons/iconbuilding';
import TextArea from '../../../common/components/TextArea';
import { IconCall } from '../../../common/icons/Contactdetailsicons/iconcall';
import { MyView } from '../../../common/components/MyView';
import { rh } from '../../../common/helpers/dimentions';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfile } from '../../../common/redux/actions/global';
import { colors } from '../../../themes/vars';
import {
  Address,
  BizsNameLabel,
  ContactNo,
  UpdateLabel,
} from '../../../common/Constants';
import PropTypes from 'prop-types';

const EditProfile = ({ open, onClose = () => {}, profile = {} }) => {
  const defaultObj = {
    businessName: '',
    address: '',
    contact: '',
    aadhaar: '',
    photo: '',
  };
  const [data, setData] = useState({ ...defaultObj });
  const [err, setErr] = useState({ ...defaultObj });
  const rowGap = 4;
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.global);

  useEffect(() => {
    initForm();
  }, [open]);

  const initForm = () => {
    setData({
      ...defaultObj,
      name: profile?.login_account?.fname || '',
      businessName: profile?.login_account?.company_name || '',
      address: profile?.login_account?.company_address || '',
      contact: profile?.login_account?.admin_number || '',
    });
    setErr({ ...defaultObj });
  };

  const handleClose = () => {
    initForm();
    onClose();
  };

  const onSubmit = () => {
    if (valid(data) === undefined) {
      dispatch(UpdateProfile(user?.authcode, data, handleClose));
    }
  };

  const valid = (vals, key) => {
    const msg = {
      businessName: 'Please enter business name.',
      name: 'Please enter name.',
      address: 'Please enter address.',
      contact: 'Please enter contact number.',
      aadhaar: 'Please enter aadhaar no.',
    };
    const er = { ...err };
    if (!key) {
      er.businessName = vals.businessName ? '' : msg.businessName;
      er.address = vals.address ? '' : msg.address;
      er.contact = vals.contact ? '' : msg.contact;
    } else {
      er[key] = vals[key] ? '' : msg[key];
    }

    const hasErr = Object.keys(err).find((x) => err[x] !== '');
    setErr({ ...er });
    return hasErr;
  };

  return (
    <ModalBottom title="Edit Profile" open={open} onClose={handleClose}>
      <View style={styles.avatarStyle}>
        <UserAvatar />
      </View>
      <View style={{ marginTop: rowGap }}>
        <Input
          placeholder={BizsNameLabel}
          value={data.businessName}
          onChangeText={(val) => {
            setData({ ...data, businessName: val });
            valid({ ...data, businessName: val }, 'businessName');
          }}
          accessoryRight={<IconBuilding />}
        />
        <Text style={styles.error} appearance="hint" status="danger">
          {err.businessName || ''}
        </Text>
      </View>
      <View style={{ marginTop: rowGap }}>
        <TextArea
          rows={5}
          placeholder={Address}
          value={data.address}
          onChange={(val) => {
            setData({ ...data, address: val });
            valid({ ...data, address: val }, 'address');
          }}
        />
        <Text style={styles.error} appearance="hint" status="danger">
          {err.address || ''}
        </Text>
      </View>
      <View style={{ marginTop: rowGap }}>
        <Input
          disabled
          placeholder={ContactNo}
          value={data.contact}
          onChangeText={(val) => {
            setData({ ...data, contact: val });
            valid({ ...data, contact: val }, 'contact');
          }}
          accessoryRight={<IconCall size={19} />}
        />
        <Text style={styles.error} appearance="hint" status="danger">
          {err.contact || ''}
        </Text>
      </View>
      <Button
        disabled={loading}
        accessoryLeft={
          loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : undefined
        }
        onPress={onSubmit}
      >
        {UpdateLabel}
      </Button>
      <MyView mb={rh(2)}></MyView>
    </ModalBottom>
  );
};

const styles = StyleSheet.create({
  avatarStyle: {
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 16,
    position: 'relative',
  },
  error: { opacity: 1 },
});

export default EditProfile;
EditProfile.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  profile: PropTypes.object,
};
