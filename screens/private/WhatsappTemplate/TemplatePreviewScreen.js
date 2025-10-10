// src/screens/TemplatePreviewScreen.js
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { previewNoteMessage, TypeYourMessageLabel, WhatsappMessagePreviewHeader } from '../../../common/Constants';
import { colors } from '../../../themes/vars';
import CustomHeader from '../../../common/components/CustomHeader';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import TemplatePreviewBubble from '../../../common/components/TemplatePreviewBubble';
import { singleToDoubleMarkers } from '../../../common/helpers/utils';
import SendIconSvg from '../../../common/icons/SendIconSvg';
import VoiceIconSvg from '../../../common/icons/VoiceIconSvg';
import PlusIconSvg from '../../../common/icons/PlusIconSvg';

const TemplatePreviewScreen=({route, navigation})=> {
  // console.log(route.params?.template, 'temp')
  const passedTemplate=route.params?.template
  
  const { headerType, headerData, bodyText, footerText, headerMedia, ctaButtons } =
    useSelector((state) => state.templateWizardWhatsapp);

    const [previewData, setPreviewData]=useState({
      headerType,
      headerData,
      bodyText,
      footerText,
      headerMedia,
      ctaButtons
    })
  // const media = headerType === 'TEXT' ? null : headerMedia;


    useEffect(() => {
    if (passedTemplate) {
      console.log('inside')
      // Map passed template to previewData
      const comps = passedTemplate.components || [];
      const headerComp = comps.find((c) => c.type === 'HEADER') || {};
      const bodyComp = comps.find((c) => c.type === 'BODY') || {};
      const footerComp = comps.find((c) => c.type === 'FOOTER') || {};
      const buttonsComp = comps.find((c) => c.type === 'BUTTONS') || {};

      setPreviewData({
        headerType: headerComp.format,
        headerData: headerComp.text || null,
        bodyText: bodyComp.text || '',
        footerText: footerComp.text || '',
        headerMedia: headerComp.example?.header_handle?.[0] ? {uri: headerComp.example.header_handle[0]}: null,
        ctaButtons: buttonsComp.buttons || [],
      });
    }else{
      console.log('outside')
    }
    // If no passedTemplate, previewData stays from redux
  }, [passedTemplate]);

  //   const {
  //   headerType,
  //   headerData,
  //   bodyText,
  //   footerText,
  //   headerMedia,
  //   ctaButtons,
  // } = previewData;
console.log(previewData)
  // Prepare media prop
  const media = previewData.headerType === 'TEXT' ? null : previewData.headerMedia;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        hidden={false}
        barStyle="light-content"
        backgroundColor={colors.WhatsapptemplateRedColor}
        translucent
      />
      <CustomHeader
        title={WhatsappMessagePreviewHeader}
        containerStyle={styles.headerContainerStyle}
        titleTextStyle={styles.headerTitleTextStyle}
        headerBgColor={colors.WhatsapptemplateRedColor}
        backIconColor={colors.white}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
         <View style={styles.contentWrapper}>
        <ImageBackground
          source={require('../../../assets/whatsappTemplateBg.png')}
          style={styles.backgroundImageStyles}
          resizeMode="cover"
        >
         
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
              <Text style={styles.noteText}>{previewNoteMessage}</Text>
              <TemplatePreviewBubble
                headerType={previewData.headerType}
                headerText={previewData.headerType === 'TEXT' ? previewData.headerData : null}
                headerMedia={media}
                bodyText={singleToDoubleMarkers(previewData.bodyText)}
                footerText={previewData.footerText}
                  buttons={previewData.ctaButtons}
              />
            </ScrollView>
         </ImageBackground>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPlaceholder}>{TypeYourMessageLabel}</Text>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <SendIconSvg />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <VoiceIconSvg/>
              </TouchableOpacity>
               <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <PlusIconSvg/>
              </TouchableOpacity>
            </View>
          </View>
       
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  headerContainerStyle: {
    justifyContent: 'center',
  },
  headerTitleTextStyle: {
    color: colors.white,
    flex: 1,
    alignSelf: 'center',
  },
   contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundImageStyles: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingTop: rh(2),
  },
  inputContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rh(2.2),
    paddingHorizontal: rw(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  inputPlaceholder: {
    flex: 1,
    color: colors.WhatsappTemplateInputBorderColor,
    fontSize: rf(2),
    fontWeight: '400',
  },
  iconButton: {
    marginLeft: rw(3),
  },
  noteText:{
    backgroundColor: colors.lightOrangeLess,
    paddingHorizontal: rw(1),
    fontSize: rf(1.2),
    color: colors.black,
    marginHorizontal: rh(2),
    paddingHorizontal: rw(2),
    paddingVertical: rh(1),
    borderRadius: rw(2),
    fontWeight: '400'
  }
});


export default TemplatePreviewScreen