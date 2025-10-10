import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
  Animated,
  Easing,
  NativeModules,
  DeviceEventEmitter,
  Alert,
  StatusBar
} from "react-native";
import { colors } from "../../themes/vars";
import { rh, rw, rf } from "../../common/helpers/dimentions";
import { getHash, startOtpListener, useOtpVerify} from "react-native-otp-verify";
import {  SIM_NUMBER_VERIFY_API_END_POINT, VerifyOtpModalTitle, VerifyOtpModalSubTitle, VerifyOtpModalFooterText, ResendOtpLabel, VerifyOtpModalSuccessText, VerifyOtpModalSuccessDesc, OtpRequestFailedLabel, OtpRequestFailedDescLabel} from "../../common/Constants";
import FetchOtpBgImg from "../../common/icons/fetchOtpBgImg";
import SuccessCheckIcon from "../../common/icons/successCheckIcon";

const VerifyOtpModal = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendEnabled, setIsResendEnabled]=useState(false)
  const [otpListenerActive, setOtpListenerActive]=useState(false)
  const inputsRef = useRef([]);
const slideAnim = useRef(new Animated.Value(0)).current;
const { KeypadDialerModule } = NativeModules;
const { stopListener,  } = useOtpVerify();


useEffect(() => {
  const eventListener = DeviceEventEmitter.addListener("showOtpModal", (phoneNumber) => {
      
      setPhoneNumber(phoneNumber)
      setShowModal(true);
  });

  return () => {
     
      eventListener.remove();
      stopListener()
  };
}, []);

  useEffect(() => {
    if (showModal) {
      requestOtp();
    }else{
      setOtp(["", "", "", ""]);
      setStep(1);
      setTimer(30);
      setIsResendEnabled(false);
      setOtpListenerActive(false);
      stopListener();
    }
  }, [showModal]);


  const verifyOtp = (enteredOtp) => {
    
    if (enteredOtp === receivedOtp) {
    
      setStep(2);
      KeypadDialerModule.onOtpVerified();
      setTimeout(() => onClose(), 2000);
    }
  };


  const onClose = () => {
    setShowModal(false);
  };


  const requestOtp = async () => {
    setLoading(true);
    setStep(1)
    setTimer(30)
    setIsResendEnabled(false);
    setOtp(["", "", "", ""]);
    stopListener(); 

    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsResendEnabled(true);
          return 0;
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    try {
      const hashKey=await getHash()
     
      const response = await fetch(SIM_NUMBER_VERIFY_API_END_POINT, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber : phoneNumber, hashkey: hashKey })
      });
      const data = await response.json();
     
      if (data) {
        
        setReceivedOtp(data.phoneNumberOTP);
        
      }else{
        // Handle API error
        showAlert()
      }
    } catch (error) {
     
      // Hanlde Netwrok error
      showAlert()
    } finally {
      setLoading(false);
      if (!showModal) {
        clearInterval(interval);
      }
    }
  };
  
useEffect(()=>{
  if(receivedOtp!=="")
  startAutoFetchOtp()
}, [receivedOtp])

  const startAutoFetchOtp=async ()=>{
    setOtpListenerActive(true)
    try{
      startOtpListener((message)=>{

        const extractedOtp = message.match(/\d{4}/)?.[0];
        if (extractedOtp) {
          setOtp(extractedOtp.split(""))
          setTimeout(()=>{
            verifyOtp(extractedOtp)
          }, 1000)
          setOtpListenerActive(false)
          stopListener()
          
        }
      })
    } catch(error){
    
      setOtpListenerActive(false);
      // Handle error (e.g., inform user to manually enter OTP)
    }
  }

const showAlert=()=>{
  Alert.alert(
    OtpRequestFailedLabel,
    OtpRequestFailedDescLabel,
    [
      { text: ResendOtpLabel, onPress: requestOtp },
    ],
    { cancelable: false }
  );
}
 





  useEffect(() => {
    slideAnim.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [step]);
  
  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0], 
  });

  const renderInitialStepContainer=()=>{
    const lastFourDigitsPhoneNumber=phoneNumber.slice(-4)
    return(
      <View style={[styles.initialStepContainer]}>
        <FetchOtpBgImg/>
        <View>
          <Text style={styles.titleText}>{VerifyOtpModalTitle}</Text>
          <Text style={[styles.titleText, styles.subTitleText]}>{VerifyOtpModalSubTitle}{lastFourDigitsPhoneNumber}</Text>
        </View>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputsRef.current[index] = ref)}
                    style={[styles.otpBox]}
                    value={digit}
                    keyboardType="numeric"
                    maxLength={1}
                    editable={false}
                  />
                ))}
              </View>
         <Text style={styles.footerText} onPress={isResendEnabled ? requestOtp : ()=>{}} disabled={!isResendEnabled}>{VerifyOtpModalFooterText} <Text style={[styles.activeFooterText, !isResendEnabled && styles.disabledResend]}>{ResendOtpLabel} {!isResendEnabled && `in ${timer}s`}</Text></Text>
      </View>
    )
  }

  const renderSuccessStepContainer=()=>{
    return(
      <View style={[styles.initialStepContainer]}>
          <View style={styles.checkIconInnerContainer}>
            <SuccessCheckIcon/>
          </View>
        <Text style={styles.titleText}>{VerifyOtpModalSuccessText}</Text>
        <Text style={[styles.titleText,styles.subTitleText]}>{VerifyOtpModalSuccessDesc}</Text>
      </View>
    )
  }

  return (
    <>
    <Modal animationType="fade" transparent={true} visible={showModal}>
    <StatusBar backgroundColor={'rgba(0,0,0,0.5)'} barStyle="light-content" translucent={true} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.backdrop}>
       
      <View style={styles.container}>
         <Animated.View style={[styles.animatedViewContainer,{ transform: [{ translateX: slideInterpolation }] }]}>
            
          {step===1 && renderInitialStepContainer()}
          {step===2 && renderSuccessStepContainer()}

          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
    </>
  );
};

export default VerifyOtpModal;



const styles = StyleSheet.create({
  backdrop: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)", 
  },
  container: { 
    backgroundColor: colors.white,
    padding: rw(5), 
    borderRadius: rw(5), 
    alignItems: "center", 
    width: "85%", 
 },
 animatedViewContainer:{
  alignItems: 'center', 
  alignSelf: 'center',
  width: '100%', 
 }, 
  otpContainer: {
     flexDirection: "row",
     justifyContent: "center", 
     marginVertical: rh(1.5), 
  },
  otpBox: { 
    width: rw(12.5), 
    height: rh(6), 
    borderWidth: 1.3, 
    borderRadius: rw(3.4),
    fontSize: rf(2), 
    textAlign: "center", 
    marginHorizontal: rw(1.8), 
    color: colors.black, 
    borderColor: colors.primary, 
    fontWeight: 'bold' 
  },
  titleText:{
    fontFamily: `Poppins`,
    fontWeight: '700',
    fontSize: rf(2.2),
    textAlign: 'center',
    color: "#000000",
    marginBottom: rh(1)
  },
  subTitleText:{
    fontWeight: '600',
    fontSize: rf(1.4),
    maxWidth: '80%',
    textAlign: 'center',
  },
  initialStepContainer:{
    alignItems: 'center',
    width: '100%',
  },  
  footerText:{
    fontFamily: `Poppins`,
    fontSize: rf(1.2),
    color: '#000000',
    fontWeight: '300',
    marginTop: rh(1)
  },
  activeFooterText:{
    color: colors.primary,
    fontWeight: 'bold',
  },
  disabledResend:{
    color: colors.grey
  },
  checkIconInnerContainer:{
      borderWidth: rw(2),
      borderColor: '#EC344A33',
      width: rw(15),
      height: rw(15),
      borderRadius: rw(15),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      padding: rw(8),
      marginVertical: rh(2)
    },
});




