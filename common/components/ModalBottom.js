/* eslint-disable no-unneeded-ternary */
/* eslint-disable react-native/no-inline-styles */
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ModalBottom = ({
  children,
  open = false,
  close = true,
  title = '',
  onClose = () => {},
  height = '85%',
  sideMargin = rw(3.5),
  hideTitle = false,
  from = ``,
  responsiveSize = 2,
  style = {}, // Add style prop
  isInsetPadding=false
}) => {

  const insets=useSafeAreaInsets()
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
          style={styles.backdrop}
        >
          <View
            style={[
              styles.container,
              {  marginHorizontal: sideMargin },
              style, // Apply custom style here
            ]}
          >
            {!hideTitle && (
              <View style={styles.title}>
                <MyText
                  bold={from === `group` ? true : true}
                  weight="500"
                  responsiveSize={responsiveSize}
                  style={{ fontFamily: `Epilogue` }}
                >
                  {title}
                </MyText>
                {close && (
                  <TouchableOpacity onPress={onClose}>
                    <View style={styles.closeStyle}>
                      <IconClose />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <ScrollView contentContainerStyle={{paddingBottom: isInsetPadding ? insets.bottom : insets.bottom * 0.3}}>{children}</ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default ModalBottom;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeStyle: {
    alignItems: 'center',
    borderRadius: rw(10),
    height: rw(8),
    justifyContent: 'center',
    marginRight: -8,
    width: rw(10),
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: Platform.OS === 'ios' ? rh(10) : rh(4),
    padding: rw(3),
    paddingTop: rw(2),
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

ModalBottom.propTypes = {
  open: PropTypes.bool,
  hideTitle: PropTypes.bool,
  title: PropTypes.string,
  from: PropTypes.string,
  sideMargin: PropTypes.number,
  height: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  responsiveSize: PropTypes.number,
  close: PropTypes.bool,
  style: PropTypes.object, // Add style to prop types
  isInsetPadding: PropTypes.bool
};
