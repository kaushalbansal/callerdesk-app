import React from 'react';
import WebViewScreen from './Profile/WebView';
import { urls } from '../../themes/vars';

const TNCApp = () => {
  return (
    <WebViewScreen
      url={urls.termsOfUse}
      title={`Terms of service`}
    ></WebViewScreen>
  );
};
export default TNCApp;
