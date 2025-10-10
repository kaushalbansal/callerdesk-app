import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { rf, rh, rw } from '../common/helpers/dimentions';
import PropTypes from 'prop-types';
import { colors } from '../themes/vars';
import CustomSwitch from '../common/components/switch';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ModalBottom from '../common/components/ModalBottom';
import { IconBreakModal } from '../common/icons/iconbreakmodal';
import { IconEntryModal } from '../common/icons/iconentrymodal';

const UserStatus = ({ route }) => {
  const { title, title1, subHead1, subHead2, func, icon, type } = route.params;
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState(true);
  const [showMessage, setShowMessage] = useState(``);
  const [showMessage1, setShowMessage1] = useState(``);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const nav = useNavigation();
  // useFocusEffect(() => {
  //   const onBackPress = () => {
  //     return true;
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   };
  // });
  
    useFocusEffect(
    useCallback(() => {
     
      const onBackPress = () => {
        // returning true prevents going back
        return true;
      };
  
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
  
      // cleanup: support both new and old RN APIs
      return () => {
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove(); // modern RN
        } else if (typeof BackHandler.removeEventListener === 'function') {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress); // legacy RN
        }
      };
    }, [])
  );
  useEffect(() => {
    type === `exit`
      ? setShowMessage(`Do you want to check-in?`)
      : setShowMessage(`Do you want to exit your break?`);
    type === `exit`
      ? setShowMessage1(
          `After check-in, you can start handling Business calls.`,
        )
      : setShowMessage1(
          `After off-break, you can start handling Business calls.`,
        );
  }, [type]);

  return (
    <ImageBackground
      source={require('../assets/userstatusbg.png')}
      style={styles.container}
    >
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.text1}>{title1}</Text>
      <View style={styles.switch}>
        <Text style={styles.textStatus}>{subHead1}</Text>
        <CustomSwitch
          checked={true}
          size="xLarge"
          // onChange={async () => {
          //   const result = await func();
          //   result.type === `success` && nav.navigate(`HomeTab`);
          //   await setStatus(false);
          // }}
          onChange={() => setShowMessageModal(true)}
        />
        <Text style={styles.textStatus}>{subHead2}</Text>
      </View>
      <View style={styles.iconHead}>
        <View style={styles.icon}>{icon}</View>
      </View>
      <ModalBottom
        title="Confirmation"
        open={showMessageModal}
        responsiveSize={2.3}
        onClose={() => setShowMessageModal(false)}
      >
        {/* <Text style={styles.label}>
          {showMessage} {showMessage1}
        </Text> */}
        {/* <View style={{ marginVertical: rh(1) }}>
          <MyText
            weight="500"
            responsiveSize={2.1}
            align="center"
            style={{ fontFamily: `Epilogue` }}
          >
            {showMessage}
          </MyText>
          <MyText
            weight="500"
            responsiveSize={2.1}
            align="center"
            style={{ fontFamily: `Epilogue` }}
          >
            {showMessage1}
          </MyText>
        </View> */}
        <View style={{ justifyContent: `center`, alignItems: `center` }}>
          {type === `break` ? <IconBreakModal /> : <IconEntryModal />}
          <Text style={styles.label1}>{showMessage}</Text>
          <Text style={styles.label}>{showMessage1}</Text>
          <View style={{ flexDirection: `row`, marginTop: rh(2) }}>
            <TouchableOpacity
              style={styles.noStyle}
              onPress={() => setShowMessageModal(false)}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesStyle}
              onPress={async () => {
                const result = await func();
                result.type === `success` && nav.navigate(`HomeTab`);
                await setStatus(false);
                await setShowMessageModal(false);
              }}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>
                Proceed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBottom>
    </ImageBackground>
  );
};

UserStatus.propTypes = {
  title: PropTypes.string,
  title1: PropTypes.string,
  subHead1: PropTypes.string,
  subHead2: PropTypes.string,
  func: PropTypes.func,
  icon: PropTypes.node,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  icon: { marginTop: rh(20), position: `absolute` },
  iconHead: { alignItems: `center` },
  label: {
    color: colors.lightBlack,
    fontSize: rf(1.75),
    // fontWeight: 500,
    marginLeft: rw(5),
    width: rw(90),
    // marginTop: rh(1),
  },
  label1: {
    color: colors.lightBlack,
    fontSize: rf(2.5),
    fontWeight: 500,
    marginLeft: rw(5),
    marginTop: rh(1),
  },
  noStyle: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  switch: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: `white`,
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginTop: rh(72),
    padding: 10,
    position: `absolute`,
    width: rw(80),
    zIndex: 999,
  },
  text: {
    alignSelf: `center`,
    fontSize: rf(3.5),
    fontWeight: `600`,
    marginTop: rh(63),
    position: `absolute`,
    textAlign: `center`,
  },
  text1: {
    alignSelf: `center`,
    color: colors.primary,
    fontSize: rf(2),
    fontWeight: `600`,
    marginTop: rh(67.5),
    position: `absolute`,
    textAlign: `center`,
  },
  textStatus: { fontWeight: `600` },
  yesStyle: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(0.7),
  },
});
export default UserStatus;
