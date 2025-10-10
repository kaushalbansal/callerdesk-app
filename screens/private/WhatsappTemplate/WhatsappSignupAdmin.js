

import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { colors } from '../../../themes/vars';
import CustomHeader from '../../../common/components/CustomHeader';
import { WATempIcon } from '../../../common/icons/waicontemp';
import EmbeddedWebView from './EmbeddedWebView';
import TemplateWizardFooterButton from '../../../common/components/TemplateWizardFooterButton';
import { loginWhatsapp, registerEmbedWhatsapp, registerWhatsapp, setWhatsappPin, updateUserEmbedSignupIntegrationStatus, verifyOtpLoginSuccess } from '../../../common/redux/actions/whatsappEmbedSignup';
import { saveWhatsappUser, updateWhatsappUser } from '../../../common/helpers/utils';

const SCREEN = {
  LOADING: 'loading',
  RELOGIN: 'relogin',
  EMBED_SIGNUP: 'embed_signup',
  WEBVIEW: 'webview',
  PIN: 'pin',
  SUCESS: 'sucess',
};


const WhatsAppSignupAdmin = ({ navigation }) => {
  const [screen, setScreen] = useState(SCREEN.LOADING);
  const [pin, setPin]=useState('')


  const dispatch = useDispatch()
  const { whatsappAccessToken, isLoading, whatsappIntegration, loadingMessage } = useSelector((state) => state?.whatsappEmbedSingnup)


  useEffect(() => {
    // if(!whatsappAccessToken){
    //   getWhatsappUser()
    //   return
    // }
    if (!whatsappIntegration) {
        // setScreen(SCREEN.EMBED_SIGNUP)
       getWhatsappUser()
      return
    }else{
      setScreen(SCREEN.SUCESS)
    }
  }, [])

    useEffect(() => {
    if (isLoading) setScreen(SCREEN.LOADING);
  }, [isLoading]);

  const getWhatsappUser = async () => {
    const result=await dispatch(registerWhatsapp())

    if(!result || !result?.success){
      setScreen(SCREEN.RELOGIN)
      return
    }

    if(result.success){
      const user={
                      whatsappAccessToken: result.accessToken,
                      whatsappRefreshToken: result.refreshToken,
                      whatsappIntegration: result.user.integration,
                  }
                  await saveWhatsappUser(user)
                 await dispatch(verifyOtpLoginSuccess(user))
                 
      setScreen(result.user.integration ? SCREEN.SUCESS : SCREEN.EMBED_SIGNUP)
    }
    }

  

   const handleShowWebView=()=>{
        setScreen(SCREEN.WEBVIEW)
        
    }

     const handleCloseWebView=()=>{
        setScreen(SCREEN.EMBED_SIGNUP)
    }

      const handleGetCode=async (code)=>{
            handleCloseWebView()
             console.log(code, 'code')
            const result =await dispatch(registerEmbedWhatsapp(code, whatsappAccessToken))
            if(result==="token expired"){
                setScreen(SCREEN.RELOGIN)
                return
            }else if(result){
                // setShowEmbedSignupButton(false)
                // setShowWebView(false)
                setScreen(SCREEN.PIN)
                
            }else{
                // setShowEmbedSignupButton(true)
                setScreen(SCREEN.EMBED_SIGNUP)
                 
            }
           
        }

         const handleSetPin=async ()=>{
                const result =await dispatch(setWhatsappPin(pin, whatsappAccessToken))
        
                if(result){
                    // setShowPinSetScreen(false)
                     updateWhatsappUser({whatsappIntegration: true})
                    dispatch(updateUserEmbedSignupIntegrationStatus())
                    setScreen(SCREEN.SUCESS)
                    // hit template list api and show template list
                    
                
                }else{
                    setScreen(SCREEN.PIN)
                }
            }

  const handleGoToTemplateScreen=()=>{
    navigation.navigate('WhatsappTemplateScreen')
  }

  const renderLoadingContainer = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingMessageText}>{loadingMessage}</Text>
        <ActivityIndicator size={rf(4)} color={colors.primary} />
      </View>

    )
  }

     const renderEmbeddSignupButton=()=>{
          return(
              <View style={styles.loadingContainer}>
                  <TouchableOpacity style={styles.embedSignupButtonContainer} onPress={handleShowWebView}>
                      <WATempIcon size={rw(6)} color={colors.white}/>
                      <Text style={styles.embedSignupText}>Start Whatsapp Embedded Signup</Text>
                  </TouchableOpacity>
              </View>
          )
      }

     const renderWebView=()=>{
            return(
                <EmbeddedWebView getCode={handleGetCode} closeWebView={handleCloseWebView}/>
            )
        }

  const renderPinSetScreen = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingMessageText}>
          Set PIN for your WhatsApp Business account to complete the registration process.
        </Text>

        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholder="● ● ● ● ● ●"
          placeholderTextColor="#bbb"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          cursorColor={colors.primary}
          style={styles.pinInput}
        />

        <TemplateWizardFooterButton
          nextLabel="SET PIN"
          onNext={handleSetPin}
          disableNext={pin.length !== 6}
          containerStyle={styles.loginButtonContainerStyle}
        />
      </View>
    )
  }

  const renderSuccessScreen=()=>{
    return(
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingMessageText}>
          Your WhatsApp Business account has been successfully registered. Now you can create or view your WhatsApp Business templates, Please click on the button below to proceed.
        </Text>
        <TemplateWizardFooterButton
          nextLabel='Go to Templates Page'
          onNext={handleGoToTemplateScreen}
          containerStyle={styles.loginButtonContainerStyle}
        />
      </View>
    )
  }

  const renderReLoginScreen=()=>{
    return(
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingMessageText}>
         Checking of Registered account failed, Please try agian or try after some time
        </Text>
        <TemplateWizardFooterButton
          nextLabel='Retry'
          onNext={getWhatsappUser}
          containerStyle={styles.loginButtonContainerStyle}
        />
      </View>
    )
  }


  const renderContent=()=>{
    switch(screen){
      case SCREEN.LOADING:
        return renderLoadingContainer();
      case SCREEN.EMBED_SIGNUP:
        return renderEmbeddSignupButton();
      case SCREEN.WEBVIEW:
        return renderWebView();
      case SCREEN.PIN:
        return renderPinSetScreen()
      case SCREEN.SUCESS:
        return renderSuccessScreen();
      case SCREEN.RELOGIN:
        return renderReLoginScreen()
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.parentContainer}>
      <CustomHeader
        title={'Whatsapp Signup'}
        // containerStyle={styles.headerContainerStyle}
        // titleTextStyle={styles.headerTitleTextStyle}
        // headerBgColor={colors.WhatsapptemplateRedColor}
        // backIconColor={colors.white}
      />

      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rw(2)
  },
  loadingMessageText: {
    fontSize: rf(2),
    fontWeight: '500',
    color: "#000000",
    textAlign: 'center',
    marginBottom: rh(1),
    paddingHorizontal: rw(4)
  },
   embedSignupButtonContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: rw(2),
      paddingVertical: rh(2),
      borderRadius: rw(1.8),
      backgroundColor: colors.green
    },
    embedSignupText:{
      color: colors.white,
      fontSize: rf(1.8),
      fontWeight: 'bold',
      marginLeft: rw(2)
    },
   pinInput: {
      width: '75%',
      height: rw(14),
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: rw(2.6),
      backgroundColor: '#f9f9f9',
      textAlign: 'center',
      fontSize: rf(3),
      fontWeight: 'bold',
      letterSpacing: rw(1.5),      // space out the characters evenly
      marginBottom: rh(4),
      marginTop: rh(1)
    },
     loginButtonContainerStyle:{
        width: '80%'
    },
});

export default WhatsAppSignupAdmin;







