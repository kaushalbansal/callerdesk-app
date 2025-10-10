import { StyleSheet, View, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { Input, Select, Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';
import ModalBottom from '../../../../common/components/ModalBottom';
import { ScrollView } from 'react-native-gesture-handler';
import { MickIcon } from '../../../../common/icons/mickicon';
import { CopyIcon } from '../../../../common/icons/copyicon';
import {
  CreateVoiceClipLabel,
  CreateVoiceTempLabel,
  SelectVoiceVariantLabel,
  TypeVoiceContentLabel,
  VoiceTempNameLabel,
  WelcomeHRHKLabel,
} from '../../../../common/Constants';
import { rf, rh, rw } from '../../../../common/helpers/dimentions';
import PropTypes from 'prop-types';

const CreateVoiceTemplate = ({ open = false, onClose = () => {} }) => {
  return (
    <ModalBottom
      height="55%"
      onClose={onClose}
      title={CreateVoiceTempLabel}
      open={open}
    >
      <ScrollView>
        <View style={{ marginTop: rh(1) }}>
          <Input placeholder={VoiceTempNameLabel} />
        </View>
        <View style={{ marginTop: rh(1.2) }}>
          <Select placeholder={SelectVoiceVariantLabel} />
        </View>
        <View style={{ marginVertical: rh(1.2) }}>
          <Text
            style={{
              color: `#656565`,
              fontSize: rf(1.4),
              fontWeight: `700`,
              marginLeft: rw(0.5),
            }}
          >
            {TypeVoiceContentLabel}
          </Text>
        </View>
        <View style={styles.welcomeStyle}>
          <Input
            numberOfLines={8}
            placeholder={WelcomeHRHKLabel}
            multiline={true}
          />
          <View style={styles.row}>
            <TouchableOpacity>
              <CopyIcon color={colors.grey} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MickIcon color={colors.grey} />
            </TouchableOpacity>
          </View>
        </View>
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>{CreateVoiceClipLabel}</Text>
        </Pressable>
      </ScrollView>
    </ModalBottom>
  );
};

export default CreateVoiceTemplate;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    elevation: 4,
    marginVertical: rh(2),
    paddingVertical: rh(1),
    width: rw(88),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  row: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-end',
    marginTop: -24,
    paddingHorizontal: 8,
  },
  welcomeStyle: { position: 'relative' },
});
CreateVoiceTemplate.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
