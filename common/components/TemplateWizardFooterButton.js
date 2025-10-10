// src/components/WizardFooter.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { rw, rf } from '../helpers/dimentions';
import { colors } from '../../themes/vars';

function TemplateWizardFooterButton({
  onBack,
  onNext,
  disableNext,
  showBack = false,
  backLabel = 'Back',
  nextLabel = 'Next',
  containerStyle,
  backButtonStyle,
  nextButtonStyle,
  backLabelStyle,
  nextLabelStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {showBack && (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, backButtonStyle]}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.backText, backLabelStyle]}>
            {backLabel}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onNext}
        disabled={disableNext}
        style={[
          styles.nextButton,
          disableNext && styles.nextDisabled,
          // if back is hidden, make this take full width
          showBack ? styles.nextHalf : styles.nextFull,
          nextButtonStyle
        ]}
        activeOpacity={disableNext ? 1 : 0.7}
      >
        <Text
          style={[styles.buttonText, styles.nextText, nextLabelStyle]}
        >
          {nextLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rw(4),
  },
  backButton: {
    flex: 1,
    paddingVertical: rw(2.5),
    paddingHorizontal: rw(4),
    alignItems: 'center',
    borderWidth: .5
  },
  nextButton: {
    paddingVertical: rw(2.5),
    paddingHorizontal: rw(4),
    borderRadius: rw(1),
    backgroundColor: colors.WhatsapptemplateRedColor,
    alignItems: 'center',
  },
  nextDisabled: {
    backgroundColor: '#CCC',
  },
  nextHalf: {
    flex: 1,
    marginLeft: rw(2),
  },
  nextFull: {
    flex: 1,
  },
  buttonText: {
    fontSize: rf(2),
    fontWeight: '500'
  },
  backText: {
    color: '#555',
  },
  nextText: {
    color: '#FFF',
  },
});

TemplateWizardFooterButton.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  disableNext: PropTypes.bool,
  showBack: PropTypes.bool,
  backLabel: PropTypes.string,
  nextLabel: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  nextButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backLabelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  nextLabelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default React.memo(TemplateWizardFooterButton);
