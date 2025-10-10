// src/common/components/DismissKeyboardView.js
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

export default function DismissKeyboardView({
  children,
  style,
  contentContainerStyle,
  scrollable = false,
  ...props
}) {
  // We want to avoid the keyboard on iOS with padding, Android with height
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const Container = scrollable ? require('react-native').ScrollView : View;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.flex, style]}
        behavior={behavior}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
        {...props}
      >
        {/* <Container
          style={[styles.flex, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        > */}
          {children}
        {/* </Container> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
