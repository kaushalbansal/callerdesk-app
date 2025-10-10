import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { Provider } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import store from './common/redux/store';
import Routes from './screens/Routes';
import { theme1 } from './themes/theme';
import GlobalLoader from './common/components/GlobalLoader';
import NoInternetScreen from './screens/nointernet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import VersionChecker from './screens/private/VersionChecker';
import SplashScreen from './screens/SplashScreen'
  import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
   const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    console.log('inside ')
    // LottieSplashScreen.hide();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <NoInternetScreen />;
  }

   // During cold start show the React Lottie splash.
  if (!showMain) {
    return (
      <SplashScreen
        onFinish={() => {
          setShowMain(true);
        }}
        // optional: pass a specific Lottie asset
        // source={require('./assets/lottie/splash.json')}
      />
    );
  }

  return (
  
    <GestureHandlerRootView style={{flex: 1}}>
    <SafeAreaProvider>
    <ApplicationProvider {...eva} theme={theme1} customMapping={{}}>
      <Provider store={store}>
        <GlobalLoader />
        <Routes />
        <VersionChecker  debug={false} forceShow={false} />
      </Provider>
    </ApplicationProvider>
    </SafeAreaProvider>
     </GestureHandlerRootView>
  );
}


// App.js
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { View, StatusBar } from 'react-native';
// import { Provider, useDispatch } from 'react-redux';
// import * as eva from '@eva-design/eva';
// import { ApplicationProvider } from '@ui-kitten/components';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { theme1 } from './themes/theme';
// import LottieView from 'lottie-react-native';
// import store from './common/redux/store';
// import Routes from './screens/Routes'; // your navigation setup
// import SplashScreen from './screens/SplashScreen'; // use your existing component
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { loginSuccess } from './common/redux/actions/common';
// import { hydrateWhatsappUser } from './common/redux/actions/whatsappEmbedSignup';
// import { loadMemberListApi } from './common/redux/actions/callLog'; // if used
// import { colors } from './themes/vars';

// const MIN_SPLASH_MS = 900; // minimum splash time to avoid flicker

// function AppInner() {
//   const dispatch = useDispatch();
//   const [bootstrapped, setBootstrapped] = useState(false);
//   const [splashDone, setSplashDone] = useState(false);

//   // run bootstrap on mount
//   useEffect(() => {
//     let mounted = true;
//     const start = Date.now();

//     async function bootstrapAsync() {
//       try {
//         // 1) Restore user from storage (example keys)
//         const raw = await AsyncStorage.getItem('user_data');
//         if (raw) {
//           const user = JSON.parse(raw);
//           // populate redux
//           dispatch(loginSuccess(user));
//           // hydrate whatsapp user if any
//           const storedWhatsappUser = await AsyncStorage.getItem('whatsappUser');
//           if (storedWhatsappUser) {
//             const parsed = JSON.parse(storedWhatsappUser);
//             dispatch(hydrateWhatsappUser(parsed));
//           }

//           // OPTIONAL: do any required lightweight startup calls
//           // e.g. loadMemberListApi to refresh small data used immediately
//           // Avoid heavy blocking network calls here; if you must, show proper loading state UI.
//           try {
//             await loadMemberListApi(user.authcode);
//           } catch (e) {
//             // ignore or log; don't block indefinitely
//             console.warn('loadMemberListApi failed', e);
//           }
//         }
//       } catch (e) {
//         console.warn('bootstrap error', e);
//       } finally {
//         // enforce min splash time
//         const elapsed = Date.now() - start;
//         const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
//         setTimeout(() => {
//           if (mounted) setBootstrapped(true);
//         }, remaining);
//       }
//     }
//     bootstrapAsync();

//     return () => {
//       mounted = false;
//     };
//   }, [dispatch]);

//   // called by your SplashScreen when animation finishes
//   const onSplashFinish = useCallback(() => {
//     setSplashDone(true);
//   }, []);

//   // while not ready, show SplashScreen
//   if (!bootstrapped || !splashDone) {
//     // render your splash; ensure SplashScreen calls onFinish() when done
//     return <SplashScreen onFinish={onSplashFinish} />;
//   }

//   // both finished -> render real app
//   return <Routes />;
// }

// export default function App() {
//   return (
//     // wrap with GestureHandlerRootView at root level
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <ApplicationProvider {...eva} theme={theme1} customMapping={{}}>
//         <Provider store={store}>
//           {/* status bar + background color to avoid white flash */}
//           <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
//           <AppInner />
//         </Provider>
//         </ApplicationProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }
