import { StyleSheet } from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';
import CustomHeader from '../../../common/components/CustomHeader';
import PropTypes from 'prop-types';

const WebViewScreen = ({ url, title }) => {
  return (
    <>
      <CustomHeader title={title}></CustomHeader>
      <WebView source={{ uri: url }} style={styles.container} />
    </>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
WebViewScreen.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
};
