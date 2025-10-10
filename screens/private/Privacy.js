import React from 'react';
import WebViewScreen from './Profile/WebView';
import { urls } from '../../themes/vars';

const PrivacyApp = () => {
  return (
    <WebViewScreen
      url={urls.privacyPolicy}
      title={`Privacy Policy`}
    ></WebViewScreen>
  );
};
export default PrivacyApp;
