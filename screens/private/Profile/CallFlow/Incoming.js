/* eslint-disable react-native/no-raw-text */
import React, { useState, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import { colors } from '../../../../themes/vars';
import { IconOutGoing } from '../../../../common/icons/iconoutgoing';
import { IconProfile } from '../../../../common/icons/iconprofile';
import { IconEqualizer } from '../../../../common/icons/equalizer';
import { IconPlay } from '../../../../common/icons/iconplay';
import { IconCallGroup } from '../../../../common/icons/callgroup';
import { IconCallStrategy } from '../../../../common/icons/callstrategy';
import MySelect from '../../../../common/components/CustomSelect/MySelect';
import { MyText } from '../../../../common/components/MyText';
import { rh, rw } from '../../../../common/helpers/dimentions';
import {
  InCallLabel,
  SelectActionLabel,
  SelectCallGroup,
  SelectCallStrategy,
  StaffBussyLabel,
  WelcomeSoundSelectLabel,
} from '../../../../common/Constants';
import PropTypes from 'prop-types';

const Incoming = React.forwardRef(
  ({ callGroupList = [], onSave = () => {} }, ref) => {
    const [formData, setFormData] = useState({
      welcome: '',
      action: '',
      callGroup: '',
      callStrategy: '',
      voiceMail: '',
    });
    const [err, setErr] = useState({
      welcome: '',
      action: '',
      callGroup: '',
      callStrategy: '',
      voiceMail: '',
    });
    const { data: audio } = useSelector((state) => state.voiceTemplate);
    const filterSoundForDdl = (type) => {
      const ob = audio.filter(
        (x) => typeof x === 'object' && x.template_type_name === type,
      );
      const temp = [];
      ob.forEach((x) => {
        temp.push({
          id: x.template_name,
          label: x.template_name,
          url: x.template_url,
        });
      });
      return temp;
    };

    const welcomeSound = useMemo(() => {
      return filterSoundForDdl('WELCOME');
    }, []);

    const voiceMailSound = useMemo(() => {
      return filterSoundForDdl('VOICE MAIL');
    }, []);

    const StepCard = ({
      children,
      first = false,
      right = false,
      stepName = '',
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
              <MyText type="help" color={colors.white}>
                {stepName}
              </MyText>
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
    };

    const ProcessLine = ({ customStyle = {} }) => {
      return (
        <View
          style={[
            styles.processLineStyle,
            {
              ...customStyle,
            },
          ]}
        ></View>
      );
    };
    ProcessLine.propTypes = {
      customStyle: PropTypes.object,
    };
    const onSelect = (key, _val) => {
      validate(key, _val);
      setFormData({ ...formData, [key]: _val });
    };

    useImperativeHandle(ref, () => ({
      getData() {
        if (!validate()) return false;
        return { ...formData };
      },
    }));

    const validate = (key, val) => {
      const error = { ...err };
      if (key) {
        error[key] = val ? '' : true;
      } else {
        Object.keys(formData).forEach((x) => {
          error[x] = formData[x] ? '' : true;
        });
      }
      setErr({ ...error });

      let valid = true;
      Object.keys(error).forEach((x) => {
        if (error[x]) {
          valid = false;
        }
      });
      return valid;
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

        <StepCard first stepName="Step 1">
          <View style={styles.stepContent}>
            <View style={styles.stepContent1}>
              <IconEqualizer size={rw(8)} />
              <View style={{ paddingLeft: rw(2.5) }}>
                <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                  {WelcomeSoundSelectLabel}
                </MyText>
                <MySelect
                  error={err.welcome}
                  w={200}
                  plain
                  noBg
                  val={formData.welcome || undefined}
                  onChange={(val) => onSelect('welcome', val)}
                  items={welcomeSound}
                />
              </View>
            </View>
            <TouchableOpacity>
              <IconPlay />
            </TouchableOpacity>
          </View>
        </StepCard>
        <StepCard stepName="Step 2" right>
          <View style={[styles.stepContent, styles.stepContent2]}>
            <IconCallGroup size={rw(8)} />
            <View style={{ paddingLeft: rw(2.5) }}>
              <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                {SelectActionLabel}
              </MyText>
              <MySelect
                error={err.action}
                w={200}
                plain
                noBg
                val={formData.action || undefined}
                onChange={(val) => onSelect('action', val)}
                items={[{ id: 1, label: 'Call group' }]}
              />
            </View>
          </View>
        </StepCard>
        <StepCard stepName="Step 3">
          <View style={[styles.stepContent, styles.stepContent2]}>
            <IconCallGroup size={rw(8)} />
            <View style={{ paddingLeft: rw(2.5) }}>
              <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                {SelectCallGroup}
              </MyText>
              <MySelect
                error={err.callGroup}
                w={200}
                plain
                noBg
                val={formData.callGroup || undefined}
                onChange={(val) => onSelect('callGroup', val)}
                items={callGroupList}
              />
            </View>
          </View>
        </StepCard>
        <StepCard stepName="Step 4" right>
          <View style={[styles.stepContent, styles.stepContent2]}>
            <IconCallStrategy size={rw(8)} />
            <View style={{ paddingLeft: rw(2.5) }}>
              <MyText type="heading" style={{ marginLeft: rw(2.5) }}>
                {SelectCallStrategy}
              </MyText>
              <MySelect
                w={200}
                plain
                noBg
                error={err.callStrategy}
                val={formData.callStrategy || undefined}
                onChange={(val) => onSelect('callStrategy', val)}
                items={[
                  { id: 1, label: 'Uniform' },
                  { id: 2, label: 'Sequential' },
                ]}
              />
            </View>
          </View>
        </StepCard>
        <View
          style={[
            styles.incomingBox,
            { width: rw(40), backgroundColor: colors.grey, marginTop: rh(3.5) },
          ]}
        >
          <View style={[styles.incomingCallCircle, { left: rw(-4) }]}>
            <IconProfile size={rw(3.5)} />
          </View>
          <MyText responsiveSize={1.5} color={colors.white}>
            {StaffBussyLabel}
          </MyText>
          <View style={[styles.dot, {}]}></View>
          <ProcessLine customStyle={{}} />
        </View>
        <StepCard first right solidBorder borderColor={colors.redBorder}>
          <View style={styles.stepContent}>
            <View style={styles.playStyle}>
              <TouchableOpacity>
                <IconPlay />
              </TouchableOpacity>
              <View style={styles.select}>
                <MySelect
                  w={200}
                  plain
                  noBg
                  error={err.voiceMail}
                  val={formData.voiceMail || undefined}
                  onChange={(val) => onSelect('voiceMail', val)}
                  items={voiceMailSound}
                />
              </View>
            </View>
            <MyText hint responsiveSize={1.5}>
              {''}
            </MyText>
          </View>
        </StepCard>
      </>
    );
  },
);
Incoming.propTypes = {
  callGroupList: PropTypes.array,
  onSave: PropTypes.func,
};
export default Incoming;

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
    borderRadius: rw(3.2),
    height: rw(3.2),
    position: 'absolute',
    top: rh(-0.8),
    width: rw(3.2),
  },
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
  playStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    paddingLeft: rw(3),
  },
  processLineStyle: {
    borderColor: colors.grey,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    height: rh(3),
    position: 'absolute',
    top: rh(-3),
  },
  select: { paddingLeft: 14 },
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
  stepContent2: { justifyContent: 'flex-start' },
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
Incoming.displayName = 'Incoming';
