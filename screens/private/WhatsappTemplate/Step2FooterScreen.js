import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import CustomTitleViewWrapper from "../../../common/components/CustomTitleViewWrapper";
import { WhatsappTemplateFooterLabel, WhatsappTemplateFooterSubtitle } from "../../../common/Constants";
import TemplateWizardInput from "../../../common/components/TemplateWizardInput";
import TemplateWizardFooterButton from "../../../common/components/TemplateWizardFooterButton";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, setFooter } from "../../../common/redux/actions/templateWizardWhatsapp";
import { rh, rw } from "../../../common/helpers/dimentions";


export default function Step2FooterScreen(){
    const {footerText}=useSelector(state=>state.templateWizardWhatsapp)
    const [localFooterText, setFooterText]=useState(footerText)
    const dispatch = useDispatch();

    const handleNext=()=>{
        dispatch(setFooter(localFooterText))
        dispatch(nextStep())
    }
    const handleBack=()=>{
        dispatch(prevStep())
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={styles.container}
            
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
            >
        <View style={styles.container}>
            <View style={styles.content}>
            <CustomTitleViewWrapper title={WhatsappTemplateFooterLabel} subTitle={WhatsappTemplateFooterSubtitle}>
        <TemplateWizardInput placeholder={"Enter Footer Text"} multiline maxLength={60} value={localFooterText} onChangeText={setFooterText} inputContainerStyle={styles.inputContainerStyle}/>
       
    </CustomTitleViewWrapper>
            </View>
     

<TemplateWizardFooterButton showBack onNext={handleNext} onBack={handleBack}  />
    
        </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
  
}

const styles=StyleSheet.create({
    container:{
        flex: 1
    },
    content: {
        flex: 1
    },
    inputContainerStyle:{
        minHeight: rw(35)
    },
})