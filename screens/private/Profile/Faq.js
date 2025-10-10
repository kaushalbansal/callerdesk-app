import React from 'react';
import { urls } from '../../../themes/vars';
import WebViewScreen from './WebView';
const Faq = () => {
  return <WebViewScreen url={urls.faq} title={`FAQ`}></WebViewScreen>;
};

export default Faq;
