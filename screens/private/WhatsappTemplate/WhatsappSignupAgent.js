

import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { colors } from '../../../themes/vars';
import CustomHeader from '../../../common/components/CustomHeader';
import { WATempIcon } from '../../../common/icons/waicontemp';
import TemplateWizardFooterButton from '../../../common/components/TemplateWizardFooterButton';
import { loginWhatsapp, registerEmbedWhatsapp, registerWhatsapp, setWhatsappPin, updateUserEmbedSignupIntegrationStatus, verifyLoginOtp, verifyOtpLoginSuccess } from '../../../common/redux/actions/whatsappEmbedSignup';
import { saveWhatsappUser, updateWhatsappUser } from '../../../common/helpers/utils';
import OtpInput from '../../../common/components/OtpInput';
import { ResendOtpLabel, VerifyOtpModalFooterText } from '../../../common/Constants';

const SCREEN = {
  LOADING: 'loading',
  RELOGIN: 'relogin',
  VERIFY_OTP: 'verifyOtp',
  SUCESS: 'sucess',
  NOT_ADMIN_REGISTER: 'notAdminRegister',
};


const WhatsAppSignupAgent = ({ navigation }) => {
  const [screen, setScreen] = useState(SCREEN.LOADING);
  const [otp, setOtp]=useState('')
  const [timer, setTimer]=useState(30)
  const [resendEnabled, setResendEnabled]=useState(false)


  const dispatch = useDispatch()
  const { user } = useSelector((state) => state?.global);
  const { whatsappAccessToken, isLoading, whatsappIntegration, loadingMessage } = useSelector((state) => state?.whatsappEmbedSingnup)


  useEffect(() => {
    if(!whatsappIntegration){
        getWhatsappUser()
    }else{
        setScreen(SCREEN.SUCESS)
    }
    // return ()=>{
    //     clearInterval()
    // }
  }, [])

    useEffect(() => {
    if (isLoading) setScreen(SCREEN.LOADING);
  }, [isLoading]);

  const getWhatsappUser = async () => {
    const {mobile_no, user_name, user_id, fname='', lname=''}=user
   const name = [fname, lname].filter(Boolean).join(' ') || 'Unknown User';
    // const staticAdminNumber="7065765493"
    const bodyData={
        name: name,
        email: user_name.toLowerCase(),
        mobile: mobile_no,
        role: 'user',
        user_id: user_id,
        adminnumber: "7065765493"
    }
    console.log(bodyData, "bodyData")
    const result=await dispatch(loginWhatsapp(bodyData))

     setTimer(30)
     setResendEnabled(false);

    if(!result){
      setScreen(SCREEN.RELOGIN)
      return
    }

    if(result.message==="Admin not found for given adminnumber" && !result.success){
        setScreen(SCREEN.NOT_ADMIN_REGISTER)
        return
    }

    if(!result.success){
        setScreen(SCREEN.RELOGIN)
        return
    }

    if(result.success && result.message==='OTP sent successfully'){
    //   const user={
    //                   whatsappAccessToken: result.accessToken,
    //                   whatsappRefreshToken: result.refreshToken,
    //                   whatsappIntegration: result.user.integration,
    //               }
    //               saveWhatsappUser(user)
    //              await dispatch(verifyOtpLoginSuccess(result))
                 
      setScreen(SCREEN.VERIFY_OTP)

       let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setResendEnabled(true);
          return 0;
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    }
    // else if(result.success && !result.user.integration){
    //   setScreen(SCREEN.NOT_ADMIN_REGISTER)
    // }

  }


    const handleVerifyOtp = async () =>{
          const userData={
              mobile: user.mobile_no,
              otp: otp
          }
          const result = await dispatch(verifyLoginOtp(userData))
          setOtp('')
          if(result.message!=="OTP verified successfully"){
              setScreen(SCREEN.VERIFY_OTP)
          }else{
            //   const user={
    //                   whatsappAccessToken: result.accessToken,
    //                   whatsappRefreshToken: result.refreshToken,
    //                   whatsappIntegration: result.user.integration,
    //               }
    //               saveWhatsappUser(user)
    //              await dispatch(verifyOtpLoginSuccess(result))
            setScreen(SCREEN.SUCESS)
          }
      }


  const handleGoToTemplateScreen=()=>{
    navigation.navigate('WhatsappTemplateScreen')
  }

  const handleGoBack=()=>{
    navigation.goBack()
  }

  const renderLoadingContainer = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingMessageText}>{loadingMessage}</Text>
        <ActivityIndicator size={rf(4)} color={colors.primary} />
      </View>

    )
  }

    

     const renderOtpFlow=()=>{
          const lastFourDigitsPhoneNumber=user.mobile_no.slice(-4)
          return(
              <View style={styles.loadingContainer}>
                  <Text style={[styles.loadingMessageText]}>We send OTP to your mobile number ******{lastFourDigitsPhoneNumber}</Text>
                  <OtpInput length={4} onChange={setOtp} containerStyle={styles.otpContainerStyle} otpInputStyle={styles.otpInputStyle}/>
                  {/* <TextInput maxLength={4} placeholder='Enter OTP' keyboardType='numeric' value={otp} onChangeText={setOtp} style={{borderWidth: 1, paddingVertical: rh(1), paddingHorizontal: rw(1)}}/> */}
                   <TemplateWizardFooterButton nextLabel='Verify OTP' onNext={handleVerifyOtp} containerStyle={styles.loginButtonContainerStyle} disableNext={otp.length!==4}/>
                    <Text style={styles.footerText} onPress={resendEnabled ? getWhatsappUser : ()=>{}} disabled={!resendEnabled}>{VerifyOtpModalFooterText} <Text style={[styles.activeFooterText, !resendEnabled && styles.disabledResend]}>{ResendOtpLabel} {!resendEnabled && `in ${timer}s`}</Text></Text>
              </View>
          )
      }

 

  const renderSuccessScreen=()=>{
    return(
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingMessageText}>
           Loggedin successfully, Now you can access your Admin WhatsApp Business templates.
        </Text>
        {/* <TemplateWizardFooterButton
          nextLabel='Go to Templates Page'
          onNext={handleGoToTemplateScreen}
          containerStyle={styles.loginButtonContainerStyle}
        /> */}
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

  const renderNotAdminRegister=()=>{
    return(
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingMessageText}>
               Your Admin WhatsApp Business account Integration is not yet done, So you can't login. Please contact your Admin.
        </Text>
        <TemplateWizardFooterButton
          nextLabel='Go Back'
          onNext={handleGoBack}
          containerStyle={styles.loginButtonContainerStyle}
        />
        </View>
    )
  }

  const renderContent=()=>{
    switch(screen){
      case SCREEN.LOADING:
        return renderLoadingContainer();
      case SCREEN.RELOGIN:
        return renderReLoginScreen();
      case SCREEN.VERIFY_OTP:
        return renderOtpFlow();
      case SCREEN.SUCESS:
        return renderSuccessScreen()
      case SCREEN.NOT_ADMIN_REGISTER:
        return renderNotAdminRegister();
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
   loginButtonContainerStyle:{
        width: '80%'
    },
      otpContainerStyle:{
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        alignSelf: 'center',
        marginTop: rh(1.5)
        
    },
    otpInputStyle:{
        marginHorizontal: rw(4),
    },
     footerText: { 
        fontSize: rf(1.5),
         color: colors.swipe, 
         marginLeft: rw(2)
         },

    activeFooterText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    disabledResend: {
        color: colors.grey
    },
});

export default WhatsAppSignupAgent;







