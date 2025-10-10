import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { IconClose } from '../../common/icons/iconclose';
import { colors } from '../../themes/vars';
import { rh, rw } from '../helpers/dimentions';
import MyText from './MyText';
import PropTypes from 'prop-types';

import { ScrollView } from 'react-native-gesture-handler';
const ModalMid = ({
  children,
  open = false,
  title = '',
  onClose = () => {},
  height = '85%',
  sideMargin = rw(3.5),
  hideTitle = false,
  from,
  scrollViewkeyboardShouldPersistTaps
}) => {
  return (
    <>
      <Modal
        animationType="slide"
        onRequestClose={onClose}
        transparent={true}
        visible={open}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={from === `payment` ? styles.backdropBlack : styles.backdrop}
        >
          <View
            style={[
              styles.container,
              // eslint-disable-next-line react-native/no-inline-styles
              { height: 'auto', marginHorizontal: sideMargin },
            ]}
          >
            {!hideTitle && (
              <View style={styles.title}>
                <MyText bold responsiveSize={2}>
                  {title}
                </MyText>
                <TouchableOpacity onPress={onClose}>
                  <View style={styles.iconCloseStyle}>
                    <IconClose />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <ScrollView keyboardShouldPersistTaps={scrollViewkeyboardShouldPersistTaps}>{children}</ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default ModalMid;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
    flex: 1,
    justifyContent: 'center',
  },
  backdropBlack: {
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: rh(10),
    padding: rw(3),
    paddingTop: rw(2),
    // marginTop:Platform.OS === 'ios' ? rh(10) : rh(4)
  },
  iconCloseStyle: {
    alignItems: 'center',
    borderRadius: rw(10),
    height: rw(8),
    justifyContent: 'center',
    marginRight: -8,
    width: rw(10),
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
ModalMid.propTypes = {
  open: PropTypes.bool,
  hideTitle: PropTypes.bool,
  title: PropTypes.string,
  from: PropTypes.string,
  sideMargin: PropTypes.number,
  height: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
