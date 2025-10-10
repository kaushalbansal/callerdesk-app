import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { colors } from '../../../themes/vars';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import {
  StrategyLabel,
  SubmitText,
  strategyText1,
  strategyText2,
} from '../../../common/Constants';
import PropTypes from 'prop-types';

const UpdateStrategy = ({ group, handleUpdate }) => {
  const [callStrategy, setCallStrategy] = useState(group.call_strategy);
  const handleCheckboxChange = (strategy) => {
    setCallStrategy(strategy);
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.containerText}>{strategyText1}</Text>
        <Text style={styles.containerText}>{strategyText2}</Text>
        <Text style={styles.containerText1}>{StrategyLabel}</Text>
        <View
          style={{ justifyContent: `flex-start`, alignItems: `flex-start` }}
        >
          {/* {checkboxes.map(checkbox => ( */}
          <View style={styles.chkbxView1}>
            <View style={styles.chkbxView2}>
              <Checkbox
                value={callStrategy === `1` ? 'checked' : 'unchecked'}
                status={callStrategy === `1` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`1`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={styles.strategy}>{'Roundrobin Ringing'}</Text>
            </View>
          </View>
          <View style={styles.chkbxView1}>
            <View style={styles.chkbxView2}>
              <Checkbox
                value={callStrategy === `2` ? 'checked' : 'unchecked'}
                status={callStrategy === `2` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`2`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={styles.strategy}>{'Sequentional Ringing'}</Text>
            </View>
          </View>
          <View style={styles.chkbxView1}>
            <View style={styles.chkbxView2}>
              <Checkbox
                value={callStrategy === `6` ? 'checked' : 'unchecked'}
                status={callStrategy === `6` ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange(`6`)}
                color={colors.primary}
              />
            </View>
            <View style={{}}>
              <Text style={styles.strategy}>{'Least Idle Ringing'}</Text>
            </View>
          </View>
          {/* ))} */}
        </View>
        <Pressable
          style={styles.btn}
          onPress={() => {
            const obj = {
              ...group,
              call_strategy: callStrategy,
            };
            handleUpdate(obj);
          }}
        >
          <Text style={styles.btnText}>{SubmitText.toUpperCase()}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default UpdateStrategy;

UpdateStrategy.propTypes = {
  group: PropTypes.object,
  handleUpdate: PropTypes.func,
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1.2),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  chkbxView1: {
    alignItems: `center`,
    flexDirection: `row`,
    marginLeft: rw(-2),
    marginVertical: rh(0),
  },
  chkbxView2: { alignItems: `center`, justifyContent: `center` },
  container: {
    alignSelf: `center`,
    backgroundColor: colors.white,
  },
  containerText: {
    color: colors.black,
    fontSize: rh(1.7),
    fontWeight: `400`,
    lineHeight: 20,
    marginLeft: rw(0),
    marginVertical: rh(1),
  },
  containerText1: {
    fontSize: rh(1.8),
    fontWeight: `500`,
    lineHeight: 20,
    marginLeft: rw(0),
    marginVertical: rh(1),
  },
  strategy: { fontSize: rf(1.7), textAlign: `center` },
});
