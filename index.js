/**
 * @format
 */
// import './reporter'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import VerifyOtpModal from './screens/BottomTabs/VerifyOtpModal';

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent('OtpModalScreen', () => VerifyOtpModal);

// lazy require to avoid a thrown exception during module evaluation preventing registration
// AppRegistry.registerComponent(appName, () => {
//   const App = require('./App').default;
//   return App;
// });
