// src/screens/Step1MessageScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard, FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { nextStep, setBodyText,  setHeaderContent, setHeaderMedia, setHeaderType, setLanguage, setName, } from '../../../common/redux/actions/templateWizardWhatsapp';
import RichTextEditor from '../../../common/components/RichTextEditor';
import Markdown from 'react-native-markdown-display'; 
import CustomTitleViewWrapper from '../../../common/components/CustomTitleViewWrapper';
import { AddTheTextLabel, AddVariableButtonLabel, CustomMarketingLabel, EditTemplateLabel, headerLabel, Languages, PREDEFINED_VARIABLES, PreDefinedVariablesLabel, selectLanguageLabel, WhatsappTemplateCreateSubLabel, WhatsappTemplateheaders, WhatsappTemplateVariableTypes, whatsappTemplateWizardInputBodyPlaceholder, whatsappTemplateWizardInputHeaderPlaceholder, } from '../../../common/Constants';
import TemplateWizardInput from '../../../common/components/TemplateWizardInput';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import TemplateWizardDropdown from '../../../common/components/TemplateWizardDropdown';
import TemplateWizardFooterButton from '../../../common/components/TemplateWizardFooterButton';
import TemplateWizardMediaUploader from '../../../common/components/TemplateWizardMediaUploader';
import { colors } from '../../../themes/vars';
import TemplateWizardVariableInputField from '../../../common/components/TemplateWizardVariableInputField';
import ModalBottom from '../../../common/components/ModalBottom';
import { allPlaceholdersAreValid, mapDisplayToBackend, removeWhatsappUser } from '../../../common/helpers/utils';
import { resetWhatsappUser } from '../../../common/redux/actions/whatsappEmbedSignup';



// Extract just the label strings for quick lookup:
const ALLOWED_LABELS = PREDEFINED_VARIABLES.map(v => v.label);

export default function Step1MessageScreen({navigation}) {
  const {name, headerType, headerData, language, bodyText, headerMedia, headerUploadedMediaToken} = useSelector(s => s.templateWizardWhatsapp);
  const dispatch = useDispatch();
  const [templateName, setTemplateName]=useState(name)
  const [localLanguage, setSelectedLanguage]=useState(language)
  const [localHeaderType, setSelectedHeaderType]=useState(headerType)
  const [headerText, setHeaderText]=useState(headerData)
  const [localHeaderMedia, setLocalHeaderMedia]=useState(headerMedia)
  const [localMediaToken, setLocalMediaToken]=useState(headerUploadedMediaToken)
  const [localBodyText, setLocalBodyText]=useState(bodyText)
  const [headerVarError, setHeaderVarError]=useState('')
  const [bodyError, setBodyError] = useState('');
  const [templateNameError, setTemplateNameError] = useState('');
  const [cursorTrigger, setCursorTrigger] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

   const [showVarModal, setShowVarModal] = useState(false);
  const [varInsertContext, setVarInsertContext] = useState(null);


  const [headerSelectionStart, setHeaderSelectionStart] =useState({ start: 0, end: 0 });;
  const [bodySelectionStart, setBodySelectionStart] = useState({ start: 0, end: 0 });
  // Refs to raw TextInput/RichTextEditor so we can focus & measure selection
  const headerInputRef = useRef(null);
  const bodyEditorRef = useRef(null);

// find any single placeholder {{…}} and extract its inner text
const hasPlaceholder = /\{\{[^}]*\}\}/.test(headerText);

   

   // Track keyboard visibility
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const needsMedia = ['image','video','document'].includes(localHeaderType.toLowerCase());
      // Next button enable
  const canNext =
  templateName.trim() &&
  !templateNameError &&
  localBodyText.trim() &&
   (localHeaderType !== 'TEXT' ||
    (Boolean(headerText.trim()) && !headerVarError)) &&
  !bodyError &&
  (!needsMedia || Boolean(localHeaderMedia))
 
  const missing = [];
if (!templateName.trim()) missing.push('template name');
if (templateNameError) missing.push('valid template name');
if (!localBodyText.trim()) missing.push('body text');
if (localHeaderType === 'TEXT' && !headerText.trim()) missing.push('header text');
if(needsMedia || Boolean(localHeaderMedia)) missing.push(`${localHeaderType.toLowerCase()}`);

  const handleChangeTemplateName=(name)=>{
    // Replace spaces with underscores
    const processedName = name.replace(/\s+/g, '_');
    setTemplateName(processedName)
    
    // Validate for special characters and hyphens (only allow alphanumeric and underscores)
    const validNameRegex = /^[a-z0-9_]+$/;
    if (processedName && !validNameRegex.test(processedName)) {
      setTemplateNameError('Template name should only contain lowercase letters, numbers, and underscores');
    } else {
      setTemplateNameError('');
    }
  }

  const handleSelectHeader=(header)=>{
    setSelectedHeaderType(header.value)
    setLocalHeaderMedia(null)
    setLocalMediaToken('')
   
  }

  const handleSelectLanguage=(language)=>{
    setSelectedLanguage({label: language.label, value: language.value })
  }

  // const handleChangeBodyText=(text)=>{
  //   setLocalBodyText(text)
  //   // dispatch(setBodyText(text))
  //   // // let processText=text.replace(/\n/g, '\\n')
 
  //   // setLocalProcessedBodyText(text)
  // }

  // ─── BODY onChangeText (validate any {{…}}) ───────────────────────────────
  const handleChangeBodyText = (text) => {
    setLocalBodyText(text);

    if (text.includes('{{') || text.includes('}}')) {
      const ok = allPlaceholdersAreValid(text, ALLOWED_LABELS);
       setBodyError(ok ? '' : 
      "Don’t modify a predefined variable. Leave each {{…}} intact or remove it entirely."
    );
    } else {
      setBodyError('');
    }
  };

  const handleNext=()=>{
        
          dispatch(setName(templateName.toLowerCase()))
          dispatch(setLanguage(localLanguage))
          dispatch(setHeaderType(localHeaderType))
          dispatch(setHeaderContent(headerText))
          dispatch(setHeaderMedia(localHeaderMedia, localMediaToken))
          dispatch(setBodyText(localBodyText))
          dispatch(nextStep());
  }

  const goToStep2=()=>{
    if(!canNext){
      Alert.alert('Incomplete form',  missing.length > 0
        ?`Add ${missing.join(', ')} to continue.`: "Fix highlighted errors to proceed")
      return
    }

          if (keyboardVisible) {
      // Dismiss and wait for keyboardDidHide before dispatching
      Keyboard.dismiss();
      const hideListener = Keyboard.addListener('keyboardDidHide', () => {
        hideListener.remove();
        handleNext();
      });
    } else {
      handleNext();
    }
  }

  


  const handleFilesChange=async(file, mediaToken)=>{
    // dispatch(setHeaderMedia(file))
    if (mediaToken === 'token expired') {
      removeWhatsappUser()
      await dispatch(resetWhatsappUser())
      navigation.navigate('WhatsappSignupAdmin')
      return
    }
    
    setLocalHeaderMedia(file)
    setLocalMediaToken(mediaToken)
  }


  const handleAddHeaderTextVariable = () => {
  onPressAddVariable('header')
    // Persist the new header content
    // dispatch(setHeaderContent(updated));
  };
  



const handleAddBodyVar = () => {
  onPressAddVariable('body')
};


 // ─── HEADER onChangeText (validate any {{…}}) ───────────────────────────
  const handleHeaderTextChange = useCallback((txt) => {
    //  1) Always update headerText
    setHeaderText(txt);

    //  2) Validate any {{…}} blocks:
    if (txt.includes('{{') || txt.includes('}}')) {
      // A) Are all placeholders exactly one of our ALLOWED_LABELS?
      const ok = allPlaceholdersAreValid(txt, ALLOWED_LABELS);
         setHeaderVarError(ok ? '' : 
      "Don’t modify a predefined variable. Leave each {{…}} intact or remove it entirely."
    );
    } else {
      // No braces at all → no error
      setHeaderVarError('');
    }
  }, []);

    const onPressAddVariable = (context) => {
    setVarInsertContext(context);
    // setShowVarModal(true);

     if (keyboardVisible) {
      Keyboard.dismiss();

      // Wait for the keyboard to actually hide, then show modal
      const hideListener = Keyboard.addListener('keyboardDidHide', () => {
        hideListener.remove();
        setShowVarModal(true);
      });
    } else {
      setShowVarModal(true);
    }

    // Make sure the editor or input is focused so we can grab cursor position:
    // if (context === 'header') {
    //   headerInputRef.current?.focus();
    // } 
  };

  const handleModalClose = async () => {
    await setShowVarModal(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bodyEditorRef.current?.focus()

      })
    })

  };



  const handleInsertVariable = (variable) => {
    if (varInsertContext === 'header') {
      const oldStart = Number(headerSelectionStart.start);
      const before = headerText.slice(0, oldStart);
      const after = headerText.slice(oldStart);
      const placeholder = `{{${variable.label}}}`;
      const newText = before + placeholder + after;
      setHeaderText(newText);

      // Move caret to the end of inserted placeholder
      //  Move caret right after placeholder
      const newPos = oldStart + placeholder.length;
      setTimeout(() => {
        headerInputRef.current?.setNativeProps({
          selection: { start: newPos, end: newPos },
        });
        setHeaderSelectionStart({ start: newPos, end: newPos });
        headerInputRef.current?.focus();
      }, 0);

      setShowVarModal(false);
    } else if (varInsertContext === 'body') {
      // const oldStart = Number(bodySelectionStart.start);
      // const before = localBodyText.slice(0, oldStart);
      // const after = localBodyText.slice(oldStart);
      // const placeholder = `{{${variable.label}}}`;
      // const newText = before + placeholder + after;
      // setLocalBodyText(newText);
      //  setCursorTrigger(t => t + 1);
      // // Move caret to the end of inserted placeholder
      // const newPos = oldStart + placeholder.length;
      // setBodySelectionStart({ start: newPos, end: newPos });
      if(bodyEditorRef.current?.insertPlaceholder){
        bodyEditorRef.current?.insertPlaceholder(variable.label);
      }
      handleModalClose()
    }
  };




    //Render: Predefined‐Variable Modal
  const renderVarModal = () => (
    <ModalBottom
     title={PreDefinedVariablesLabel}
     open={showVarModal}
      onClose={()=>setShowVarModal(false)}
      sideMargin={0}
    >
        <View>
          <View style={styles.modalVariableList}>
          {PREDEFINED_VARIABLES.map((item, index)=>{
            return (
              
               <TouchableOpacity
                key={index}
                style={styles.modalVariableItem}
                onPress={() => handleInsertVariable(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalVariableItemText}>{item.label}</Text>
             
              </TouchableOpacity>
              
            )
          })}
          </View>
        </View>
    </ModalBottom>
  );




  const renderHeaderTypeTextContainer=()=>{
    return(
      <>
       <TemplateWizardInput
       ref={headerInputRef}
       value={headerText}
       onChangeText={handleHeaderTextChange}
        onSelectionChange={({ nativeEvent }) =>{
                  // setHeaderSelectionStart({
                  //   start: nativeEvent.selection.start,
                  //   end: nativeEvent.selection.end
                  // })
                   // Coerce to number explicitly:
          const start = Number(nativeEvent.selection.start);
          const end = Number(nativeEvent.selection.end);
          setHeaderSelectionStart({ start, end });
        }}
       placeholder={`${whatsappTemplateWizardInputHeaderPlaceholder} ${localLanguage.label}`}
       maxLength={60}
       error={headerVarError}
       label={"Header Text"}
       selection={headerSelectionStart}
     />
       {/* Add Variable Button */}
       <TouchableOpacity
                style={[
                  styles.addVariableContainer,
                  (hasPlaceholder || headerText.length + 4 > 60) && styles.disbleAddVariableButton
                ]}
                disabled={hasPlaceholder || headerText.length + 4 > 60}
                onPress={handleAddHeaderTextVariable}
              >
                <Text style={styles.addVariableText}>{AddVariableButtonLabel}</Text>
              </TouchableOpacity>
      </>
    )
  }
 const HEADER_HEIGHT = 56 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);
  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
    // keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
    >
     <View style={styles.container}> 
      <ScrollView style={styles.containerStyle} contentContainerStyle={styles.scrollViewContainerStyle}
        keyboardShouldPersistTaps="handled"
        // keyboardDismissMode='on-drag'
      >
          <CustomTitleViewWrapper title={CustomMarketingLabel} subTitle={WhatsappTemplateCreateSubLabel} containerStyle={styles.marketingMessagingContainer}>
      <TemplateWizardInput
        value={templateName}
        onChangeText={(name)=>handleChangeTemplateName(name)}
        placeholder={'Enter your template name'}
        maxLength={512}
        containerStyle={styles.nameInputContainer}
        autoCapitalize={"none"}
        error={templateNameError}
      />
      <TemplateWizardDropdown
        placeholder={selectLanguageLabel}
        value={localLanguage.value}
        onChange={(item)=>handleSelectLanguage(item)}
        data={Languages}
      />
      </CustomTitleViewWrapper>
      <CustomTitleViewWrapper title={EditTemplateLabel} subTitle={WhatsappTemplateCreateSubLabel}>


      <TemplateWizardDropdown 
        placeholder={headerLabel}
        value={localHeaderType}
        onChange={(header)=>handleSelectHeader(header)}
        data={WhatsappTemplateheaders}
    />
    {localHeaderType==="TEXT" &&  renderHeaderTypeTextContainer()}
       {['image','video','document'].includes(localHeaderType.toLowerCase()) && (
        <TemplateWizardMediaUploader
          file={localHeaderMedia}
          type={localHeaderType.toLowerCase()}
          maxFiles={1}
          buttonLabel={`${AddTheTextLabel} ${localHeaderType.toLowerCase()}`}
          onFileChange={handleFilesChange}
        />
      )}
      <RichTextEditor
      ref={bodyEditorRef}
        value={localBodyText}
        onChangeText={handleChangeBodyText}
        placeholder={`${whatsappTemplateWizardInputBodyPlaceholder} ${localLanguage.label}`}
        containerStyle={bodyError ? {borderColor: colors.primary}: {}}
        
      />
      {bodyError ? (
  <Text style={{ color: colors.error, marginTop: rh(1) }}>
    {bodyError}
  </Text>
) : null}
       <TouchableOpacity
      style={[styles.addVariableContainer,
        // disable if name-type and text ends …}} or too long
        // localVariableType === 'name'
        //   ? headerText.length + 4 > 60 || false
        //   : false
      ]}
      onPress={handleAddBodyVar}
    >
      <Text style={styles.addVariableText}>{AddVariableButtonLabel}</Text>
    </TouchableOpacity>

      </CustomTitleViewWrapper>
      </ScrollView>

      {/* Preview block below, if you want inline preview */}
      {/* <Markdown style={{ body: { fontSize: 16, marginTop: 8 } }}>
        {localBodyText}
      </Markdown> */}
       {renderVarModal()}
      <TemplateWizardFooterButton onNext={goToStep2}  containerStyle={styles.buttonContainerStyle}/>
    </View>
     </KeyboardAvoidingView>
    // </TouchableWithoutFeedback>
  );
}

const styles=StyleSheet.create(({
  container:{
    flex: 1,
    // justifyContent: 'space-between'
  },
  containerStyle: {
    // height: '80%',
    flex: 1
   
  },
  scrollViewContainerStyle:{
    paddingBottom: 0
  },
  nameInputContainer:{
    marginTop: rh(2)
  },
  marketingMessagingContainer:{
    paddingBottom: rh(2.5),
    marginBottom: rh(2.2)
  },
  buttonContainerStyle:{
    // marginVertical: rh(1),
    // position: 'absolute',
    // bottom: 0
  },
  addVariableContainer:{
    marginVertical: rh(1.5),
    borderWidth: 1.2,
    borderColor: colors.WhatsapptemplateRedColor,
    borderRadius: rw(1.5),
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.5),
    textAlign: 'center',
    alignSelf: 'flex-end'
  },
  disbleAddVariableButton:{
    opacity: 0.38
  },
  addVariableText:{
    color: colors.WhatsapptemplateRedColor,
    fontWeight: '400',
    fontSize: rf(1.5),
    textAlign: 'center'
  },
  modalVariableList:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: rh(1)
  },
  modalVariableItem:{
    borderWidth: 1.2,
    borderColor: colors.lightGrey,
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.8),
    marginHorizontal: rw(1),
    marginVertical: rh(1),
    borderRadius: rw(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalVariableItemText:{
    fontSize: rf(1.5),
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
  }

}))