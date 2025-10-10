/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { colors } from '../../../../themes/vars';
import { IconEqualizer } from '../../../../common/icons/equalizer';
import { IconPlay } from '../../../../common/icons/iconplay';
import MySelect from '../../../../common/components/CustomSelect/MySelect';
import { IconPlusRounded } from '../../../../common/icons/plusrounded';
import { MyText } from '../../../../common/components/MyText';
import { rh, rw } from '../../../../common/helpers/dimentions';
import {
  InitialVoiceSelectLabel,
  PressLabel,
  WelcomeSoundDummy,
} from '../../../../common/Constants';
import PropTypes from 'prop-types';

export const StepCard = ({
  children,
  first = false,
  right = false,
  stepName = '',
  mt = 28,
  solidBorder = false,
  borderColor = colors.grey,
}) => {
  const dotStyle = first
    ? { left: undefined, right: undefined }
    : {
        right: right ? undefined : 28,
        left: right ? 28 : undefined,
      };

  const lineStyle = first
    ? { left: undefined, right: undefined }
    : {
        right: right ? undefined : 34,
        left: right ? 34 : undefined,
      };

  return (
    <View
      style={[
        styles.dashedBorder,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          marginTop: rh(3),
          borderStyle: solidBorder ? 'solid' : 'dashed',
          borderColor,
        },
      ]}
    >
      <View style={[styles.dot, { ...dotStyle }]}></View>
      <ProcessLine customStyle={lineStyle} />
      {stepName && (
        <View
          style={[
            styles.stepName,
            { right: right ? rw(2.8) : undefined },
            { left: right ? undefined : rw(2.8) },
          ]}
        >
          <Text style={{ color: colors.white }}>{stepName}</Text>
        </View>
      )}
      {children}
    </View>
  );
};
StepCard.propTypes = {
  first: PropTypes.bool,
  right: PropTypes.bool,
  solidBorder: PropTypes.bool,
  stepName: PropTypes.string,
  borderColor: PropTypes.string,
  children: PropTypes.node,
  mt: PropTypes.number,
};

export const ProcessLine = ({ customStyle = {} }) => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        height: rh(3),
        borderLeftWidth: 2,
        borderStyle: 'dashed',
        position: 'absolute',
        borderColor: colors.grey,
        top: rh(-3),
        ...customStyle,
      }}
    ></View>
  );
};
ProcessLine.propTypes = {
  customStyle: PropTypes.object,
};

const DepartIncomingStep = ({ step, onToggle }) => {
  return (
    <>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onToggle(step)}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'relative',
            backgroundColor: step.expanded ? colors.link : colors.grey,
            marginTop: rh(1),
            paddingHorizontal: rw(2),
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          <MyText responsiveSize={1.6} color={colors.white}>
            {PressLabel} {step.key} {step.expanded ? '-' : '+'}
          </MyText>
        </View>
      </TouchableOpacity>
      {step.expanded && (
        <>
          <StepCard mt={16} first right>
            <View style={styles.stepContent}>
              <View style={styles.stepContent1}>
                <IconEqualizer size={rw(8)} />
                <View style={{ paddingLeft: rw(1.5) }}>
                  <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                    {InitialVoiceSelectLabel} {step.key}
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
          <View style={styles.row}>
            <TouchableOpacity style={styles.icon}>
              <IconPlusRounded />
            </TouchableOpacity>
            <View style={styles.rowLine}></View>
          </View>
          <View style={styles.selectStyle}>
            <MySelect noBg w={100} />
            <MySelect noBg w={95} />
            <MySelect noBg w={100} />
          </View>
          <View style={styles.selectHead}>
            <View style={styles.rowLine1}></View>
          </View>
          <View style={styles.selectHead}>
            <MySelect noBg w={100} />
            <MySelect noBg w={95} />
            <MySelect noBg w={100} />
            <View style={styles.selectStyle1}></View>
          </View>
        </>
      )}
    </>
  );
};
DepartIncomingStep.propTypes = {
  step: PropTypes.object,
  onToggle: PropTypes.func,
};
export default DepartIncomingStep;

const styles = StyleSheet.create({
  dashedBorder: {
    alignItems: 'center',
    borderColor: colors.black,
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: rh(6),
    paddingVertical: rw(2),
    position: 'relative',
    width: '100%',
  },
  dot: {
    backgroundColor: colors.grey,
    borderRadius: rw(3),
    height: rw(3),
    position: 'absolute',
    top: rh(-0.8),
    width: rw(3),
  },
  icon: { marginTop: -11 },
  row: {
    alignItems: 'center',
    borderColor: colors.grey,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    height: 20,
    marginTop: 20,
    position: 'relative',
    width: '80%',
  },
  rowLine: {
    borderColor: colors.grey,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    height: rh(4),
    left: '50%',
    position: 'absolute',
    top: -20,
  },
  rowLine1: {
    borderColor: colors.grey,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    height: 10,
    left: '50%',
    position: 'absolute',
    top: 0,
  },
  selectHead: {
    borderColor: colors.grey,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'dashed',
    height: 10,
    position: 'relative',
    width: '80%',
  },
  selectStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  selectStyle1: {
    borderColor: colors.grey,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    bottom: -10,
    height: 10,
    left: '50%',
    position: 'absolute',
  },
  stepContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  stepContent1: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
  },
  stepName: {
    alignItems: 'center',
    backgroundColor: colors.grey,
    borderRadius: 4,
    height: rh(2.2),
    justifyContent: 'center',
    left: rw(1.2),
    minWidth: rw(15),
    paddingHorizontal: rw(1),
    position: 'absolute',
    top: rh(-1.3),
  },
});
