// src/screens/TemplateWizardScreen.js
import React, { useCallback } from 'react';
import { View, StyleSheet, Text, StatusBar, Alert, BackHandler,  TouchableOpacity  } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
// Plain Redux action imports
import {  resetWizard } from '../../../common/redux/actions/templateWizardWhatsapp';

import Step1MessageScreen from './Step1MessageScreen';
import Step2FooterScreen   from './Step2FooterScreen';
import Step3ButtonScreen  from './Step3ButtonScreen';
import { CreateWhatsappTemplateHeaderTitle,} from '../../../common/Constants';
import Stepper from '../../../common/components/Stepper';
import { colors } from '../../../themes/vars';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { IconGoBack } from '../../../common/icons/goback';

export default function TemplateWizardScreen({ navigation }) {
  const {step} = useSelector(state => state.templateWizardWhatsapp);
  const dispatch = useDispatch();

  // Handle device back button press
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true; // Prevent default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [handleGoBack])
  );


const renderCurrentStepComponent=()=>{
return(
    <>
    {step === 1 && <Step1MessageScreen /> }
    {step === 2 && <Step2FooterScreen /> }
    {step === 3 && <Step3ButtonScreen navigation={navigation}/> }
    </>
)
    
}

  const goBack = useCallback(async () => {
        await dispatch(resetWizard());
        navigation.goBack()
    }, [dispatch, navigation]);

  const handleGoBack = useCallback(() => {
    Alert.alert("Your progress will be lost", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => console.log('cancel pressed'),
      },
      {
        text: "Yes",
        onPress: goBack
      }
    ])
  }, [goBack]);


const renderHeader=()=>{
  return(
    <View style={styles.headerContainerStyle}>
      <TouchableOpacity onPress={handleGoBack} style={styles.headerBackButtonIconContainer}>
      <IconGoBack color={colors.white}/>
      </TouchableOpacity>
      <Text style={styles.headerTitleTextStyle}>{CreateWhatsappTemplateHeaderTitle}</Text>
    </View>
  )
}

  return (
    <View style={styles.container}>
        <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor={colors.WhatsapptemplateRedColor}
          translucent
        />
        {renderHeader()}
        <View style={styles.innerMainContainer}>

        
      <Stepper current={step} total={3} />
    

      {renderCurrentStepComponent()}

     
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerStyle:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WhatsapptemplateRedColor,
    paddingHorizontal: rw(4),
    paddingVertical: rh(1),
    paddingBottom: rh(1.5)
  },
  headerTitleTextStyle:{
    color: colors.white,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center', 
    fontSize: rf(2),
    fontWeight: 'bold'
    // marginLeft: rw(5)
  },
  headerBackButtonIconContainer:{
    paddingHorizontal: rw(2),  
    alignItems: 'center'
  },
  innerMainContainer:{
    alignSelf: 'center',
    width: '90%',
    flex: 1
    // alignItems: 'center'
  },
});
