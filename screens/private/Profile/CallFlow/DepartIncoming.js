/* eslint-disable react-native/no-raw-text */
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text } from '@ui-kitten/components';

import { colors } from '../../../../themes/vars';
import { IconOutGoing } from '../../../../common/icons/iconoutgoing';
import { IconProfile } from '../../../../common/icons/iconprofile';
import { IconEqualizer } from '../../../../common/icons/equalizer';
import { IconPlay } from '../../../../common/icons/iconplay';
import MySelect from '../../../../common/components/CustomSelect/MySelect';
import { MyText } from '../../../../common/components/MyText';
import { MyView } from '../../../../common/components/MyView';
import { rh, rw } from '../../../../common/helpers/dimentions';
import DepartIncomingStep, {
  StepCard,
  ProcessLine,
} from './DepartIncomingStep';
import { IconCall } from '../../../../common/icons/Contactdetailsicons/iconcall';
import {
  CallEndLabel,
  InCallLabel,
  InvalidActionLabel,
  InvalidKeySoundLabel,
  KeyLabel,
  WelcomeSoundDummy,
  WelcomeSoundLabel,
} from '../../../../common/Constants';

const DepartIncoming = () => {
  const _step = { key: 1, expanded: false };
  const [steps, setSteps] = useState([
    { ..._step, expanded: true },
    { ..._step, key: 2 },
    { ..._step, key: 3 },
    { ..._step, key: 4 },
    { ..._step, key: 5 },
    { ..._step, key: 6 },
    { ..._step, key: 7 },
    { ..._step, key: 8 },
    { ..._step, key: 9 },
  ]);

  useEffect(() => {}, []);

  const toggleExpand = (currentStep) => {
    let _temp = [...steps];
    _temp = _temp.map((x) => {
      x.expanded = x.key === currentStep.key ? !x.expanded : x.expanded;
      return x;
    });
    setSteps([..._temp]);
  };

  return (
    <>
      <View style={styles.incomingBox}>
        <View style={styles.incomingCallCircle}>
          <IconOutGoing size={rw(3.5)} />
        </View>
        <MyText color={colors.white} responsiveSize={1.5}>
          {InCallLabel}
        </MyText>
      </View>
      <StepCard first mt={16}>
        <View style={styles.stepContent}>
          <View style={styles.stepContent1}>
            <IconEqualizer size={rw(8)} />
            <View style={{ paddingLeft: rw(1.5) }}>
              <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                {WelcomeSoundLabel}
              </MyText>
              <MySelect
                w={200}
                plain
                noBg
                items={[{ id: 1, label: WelcomeSoundDummy }]}
              />
            </View>
          </View>
          <TouchableOpacity>
            <IconPlay />
          </TouchableOpacity>
        </View>
      </StepCard>

      <View
        style={[
          styles.incomingBox,
          { backgroundColor: colors.grey, width: rw(18), marginTop: rh(3) },
        ]}
      >
        <View style={styles.incomingCallCircle}>
          <IconProfile size={rw(3.5)} />
        </View>
        <Text style={{ color: colors.white }}>{KeyLabel}</Text>
        <View style={[styles.dot, {}]}></View>
        <ProcessLine customStyle={{}} />
        <ProcessLine customStyle={styles.procesLine} />
      </View>
      {steps.map((step, i) => {
        return (
          <DepartIncomingStep step={step} key={i} onToggle={toggleExpand} />
        );
      })}
      <StepCard first mt={16}>
        <View style={styles.stepContent}>
          <View style={styles.iconStyle}>
            <IconEqualizer size={rw(8)} />
            <View style={{ paddingLeft: rw(1.5) }}>
              <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                {InvalidActionLabel}
              </MyText>
              <MySelect
                w={200}
                plain
                noBg
                items={[{ id: 1, label: WelcomeSoundDummy }]}
              />
            </View>
          </View>
          <TouchableOpacity>
            <IconPlay />
          </TouchableOpacity>
        </View>
      </StepCard>
      <View style={styles.callEndBox}>
        <View style={styles.incomingCallCircle}>
          <IconCall size={rw(3.5)} color={colors.primary} />
        </View>
        <MyText color={colors.white} responsiveSize={1.5}>
          {CallEndLabel}
        </MyText>
        <View style={[styles.dot, {}]}></View>
        <ProcessLine />
        <View style={styles.invalidStyle}>
          <MyText hint responsiveSize={1.4}>
            {InvalidKeySoundLabel}
          </MyText>
        </View>
      </View>
      <MyView h={rh(2)}>{''}</MyView>
    </>
  );
};

export default DepartIncoming;

const styles = StyleSheet.create({
  callEndBox: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
    elevation: 5,
    height: rh(4),
    justifyContent: 'center',
    marginTop: rh(3),
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: rw(20),
  },
  dot: {
    backgroundColor: colors.grey,
    borderRadius: rw(3),
    height: rw(3),
    position: 'absolute',
    top: rh(-0.8),
    width: rw(3),
  },
  iconStyle: { alignItems: 'center', flexDirection: 'row', flexGrow: 1 },
  incomingBox: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 5,
    elevation: 5,
    height: rh(4),
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: rw(35),
  },
  incomingCallCircle: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: rh(3.5),
    elevation: 5,
    height: rh(3.5),
    justifyContent: 'center',
    left: rw(-3.5),
    position: 'absolute',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: rh(0.2),
    width: rh(3.5),
  },
  invalidStyle: {
    alignItems: 'center',
    minWidth: 320,
    position: 'absolute',
    top: -23,
  },
  procesLine: { top: 35 },
  stepContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  stepContent1: { alignItems: 'center', flexDirection: 'row', flexGrow: 1 },
});
