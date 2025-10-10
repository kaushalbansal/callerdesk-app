import React from 'react';
import WebViewScreen from './Profile/WebView';
import { urls } from '../../themes/vars';

const AboutApp = () => {
  return <WebViewScreen url={urls.aboutUs} title={`About app`}></WebViewScreen>;
};
export default AboutApp;
