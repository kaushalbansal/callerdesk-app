import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { rh, rw } from '../../../common/helpers/dimentions';

function getParamFromUrl(url, paramName) {
  const [base, fragment] = url.split('#');
  const query = (base.split('?')[1] || '') + (fragment ? '&' + fragment : '');
  return query
    .split('&')
    .map(kv => kv.split('='))
    .find(([k]) => k === paramName)?.[1] || null;
}

function parseCbFragment(url) {
  // split off "#cb=…"
  const [, frag] = url.split('#cb=');
  if (!frag) return null;

  try {
    // URL-decode & parse JSON
    const json = decodeURIComponent(frag);
    return JSON.parse(json);
  } catch {
    return null;
  }
}


export default function EmbeddedWebView({ getCode, closeWebView,  }) {
  const [loading, setLoading] = useState(false);
  const webviewRef = useRef(null);
  // const EMBED_URL = 'https://96f9-106-219-230-172.ngrok-free.app/';
  const EMBED_URL='https://mukulkumar8285.github.io/facebooksdk/index.html'

  // const authUrl = `https://www.facebook.com/v18.0/dialog/oauth`
  // + `?client_id=523707793850383`
  // + `&redirect_uri=${encodeURIComponent('https://mukulkumar8285.github.io/facebooksdk/embed.html')}`
  // + `&response_type=code`
  // + `&config_id=683389464136204`
  // + `&scope=whatsapp_business_management,whatsapp_business_messaging`

const onNavStateChange = ({ url, loading: navLoading }) => {
console.log(url , "url===>")
    // console.log(url, 'url===>')
  // setLoading(navLoading);

  // only proceed if we hit our embed URL and a cb= fragment
  // if (url.startsWith(' 'https://96f9-106-219-230-172.ngrok-free.app/whatsapp-callback  ')) {
  // if ( url.includes('code')) {
    const code=getParamFromUrl(url, 'code')
    console.log(code, 'this is code I want')
    // if (code) {
    //   getCode(code)
    // }else{
    //      const error=getParamFromUrl(url, 'error')
    // if(error){
    //   console.log(error, 'error')
    //   closeWebView()
    // }
    // // console.log(url, 'else case url')
    // }
  // }
 
  
};

const handleNav=(navState)=>{
  const url = navState.url;
  console.log(url, 'url')
  // Check if this is the redirect URI
  if (url.startsWith(REDIRECT_URI)) {
    // Parse out the `code` param
    const codeMatch = url.match(/[?&]code=([^&]+)/);
    const code = codeMatch && codeMatch[1];
    if (code) {
      console.log('OAuth code received:', code);
      getCode(code)
      // TODO: send `code` to backend securely (see below)
      // Then close or hide the WebView
    }else{
      closeWebView()
    }
  }
}


 const handleNavigation = (event) => {
    console.log(event, 'event==>')
    const { url } = event;
// console.log(url, 'this is ur=====>')
    // Check if the URL contains the token (comes after redirect)
    // if (url.startsWith('https%3A%2F%2F7f69-2401-4900-1c5e-3b4d-3539-6caa-fb9-fb10.ngrok-free.app')) {
    //   const match = url.match(/access_token=([^&]+)/);
    //   if (match && match[1]) {
    //     const token = match[1];
    //     console.log(token, 'token---->')
    //     Alert.alert('Access Token Received', token);
    //     // TODO: Save this token securely (e.g., AsyncStorage or backend)
    //   }

      
    // }

    // if(url.includes('code=')){
    
    //   const code = new URL(url).searchParams.get("code");
    //   console.log(code, 'first if ==>')
    // }
    //  if (url.includes("https%3A%2F%2F7f69-2401-4900-1c5e-3b4d-3539-6caa-fb9-fb10.ngrok-free.app")) {
    //         // Extract authorization code from the URL
    //         const code = new URL(url).searchParams.get("code");
    //         console.log("Authorization Code: second if statement", code);



    //         // Send this code to your backend to get the access token
    //       }


      // Only proceed if the WebView has navigated to our redirect URI
    if (url.includes('code')) {
      // Try to pull out either “code” (from ? or #)
      // const code = getParamFromUrl(url, 'response_type');
      const code2 = getParamFromUrl(url, 'code');
      const business_id=getParamFromUrl(url, 'business_id')
      const nonce=getParamFromUrl(url, 'nonce')
      // console.log(code, 'code=====>', code2, 'code2==')
      if (code2==='') {
        //  • In Prod: send this “code” to your backend to exchange for a long-lived access token.
        //  • Here, we just show an Alert for demonstration.
        // console.log(code, 'if auth code')
        // navigation.goBack()
        // Alert.alert('Authorization Code', code);

        // OPTIONAL: Close or navigate away
        // e.g. navigation.goBack(); or navigation.replace('Home');
        // const url=https://whatsapi.callerdesk.io/whatsappauth?code=${code2}
      }  else if(code2){
        console.log(code2, ' auth code')
        console.log(business_id, 'businessid=============>')
        console.log(nonce, 'nonce')
          setIsLoading(true)
          fetch(`https://4a71-223-233-69-127.ngrok-free.app/whatsappauth?code=${code2}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODNmZjE2ZmQyZTYzYmQ3ZDQxOTg4NDAiLCJlbWFpbCI6Im11a3VsdmVkMDdAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwibW9iaWxlIjoiODI4NTIxNzQ5NiIsImlhdCI6MTc0OTQ0NzQ4NywiZXhwIjoxNzQ5NTMzODg3fQ.occ4xu-mpW-DKQRDx8JEJgaXD5dV6M7ixb-czQ41h4A`
           },
          // body: JSON.stringify({ code, businessId }),
        })
          .then((r) => r.json())
          .then((json) => {
            console.log('BACKEND RESPONSE →', json);
            Alert.alert('Backend response', JSON.stringify(json))
            // setShowWebView(false)
            setIsLoading(false)
            // json should contain at least:
            // { accessToken: '…', wabaId: '2037440503145616', phoneNumberId: '112233445566778' }
            // Now you can navigate away, or store these in secure storage, etc.
            // navigation.replace('HomeScreen');
          })
          .catch((err) => {
            console.error(err);
            Alert.alert('Error', 'Failed to exchange code on the server.');
            setIsLoading(false)
          });
        // navigation.navigate('WhatsappSignup')
        // Alert.alert('Authorization Code', code2);


      } 
      
      
      else {
        // If there’s no “code” but you expect an error or the user denied, you can check “error_reason” etc.
        const error = getParamFromUrl(url, 'error');
        if (error) {
          setShowWebView(false)
          console.log(error, 'error')
          Alert.alert('OAuth Error', error);
        }
      }
    }
    
  };



  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          size="large"
        />
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: EMBED_URL }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        onNavigationStateChange={onNavStateChange}
        setSupportMultipleWindows={false}
        startInLoadingState={true}
          onMessage={event => {
            console.log(event, 'event')
       const data = JSON.parse(event.nativeEvent.data);
       
       if (data.success && data.code) {
        console.log(data, 'insdie success true')
         // Use data.code to exchange for a permanent token on your backend
       }else{
        console.log(data, 'inside else false')
       }
       // Handle other events (signup_completed, errors, etc.)
     }}
        // style={{height: rh(500), width: rw(500)}}
        // thirdPartyCookiesEnabled={true}
        // sharedCookiesEnabled={true}
        // userAgent='userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/... Chrome/... Safari/..."'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
