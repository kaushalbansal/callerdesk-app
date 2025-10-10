import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalBottom from '../../common/components/ModalBottom';
import { colors } from '../../themes/vars';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import { NoAppRoutingAlertHead } from '../../common/Constants';
import PropTypes from 'prop-types';

const NoAppRoutingModal = ({ showDiler, setShowDiler }) => {
  return (
    <ModalBottom
      title="No permission to make calls"
      open={showDiler}
      onClose={() => setShowDiler(false)}
    >
      <Text style={styles.modalText}>{NoAppRoutingAlertHead}</Text>
      <TouchableOpacity
        style={styles.okButton}
        onPress={() => setShowDiler(false)}
      >
        <Text style={styles.okButtonText}>Ok</Text>
      </TouchableOpacity>
    </ModalBottom>
  );
};

const styles = StyleSheet.create({
  modalText: {
    color: colors.primary,
    fontSize: rf(2),
    marginVertical: rh(2),
    textAlign: 'center',
  },
  okButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: rw(5),
    paddingHorizontal: rw(5),
    paddingVertical: rh(1),
  },
  okButtonText: {
    color: colors.white,
    fontSize: rf(1.8),
    textAlign: 'center',
    width: '100%',
  },
});

export default NoAppRoutingModal;

NoAppRoutingModal.propTypes = {
  showDiler: PropTypes.bool,
  setShowDiler: PropTypes.func,
};
