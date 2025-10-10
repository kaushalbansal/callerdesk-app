import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import CustomTitleViewWrapper from "../../../common/components/CustomTitleViewWrapper";
import { AddButtonsTextSubtitle, AddButtonsTextTitle, WhatsappTemplateActionButtonsList, WhatsappTemplateButtonLabel, WhatsappTemplateButtonSubtitle, } from "../../../common/Constants";
import TemplateWizardInput from "../../../common/components/TemplateWizardInput";
import TemplateWizardFooterButton from "../../../common/components/TemplateWizardFooterButton";
import { useDispatch, useSelector } from "react-redux";
import { addButton, createTemplate, nextStep, prevStep, removeButton, resetWizard, updateButton } from "../../../common/redux/actions/templateWizardWhatsapp";
import { rf, rh, rw } from "../../../common/helpers/dimentions";
import TemplateWizardDropdown from '../../../common/components/TemplateWizardDropdown';
import { removeWhatsappUser, toastShow } from "../../../common/helpers/utils";
import { colors } from "../../../themes/vars";
import PlusIconSvg from "../../../common/icons/PlusIconSvg";
import ModalBottom from "../../../common/components/ModalBottom";
import SideArrowSvgIcon from "../../../common/icons/SideArrowSvgIcon";
import TemplateWizardActionButtonModal from "../../../common/components/TemplateWizardActionButtonModal";
import TemplateEditIconSvg from "../../../common/icons/TemplateEditIconSvg";
import TemplateDeleteIconSvg from "../../../common/icons/TemplateDeleteIconSvg";
import { resetWhatsappUser } from "../../../common/redux/actions/whatsappEmbedSignup";


const FIELD_BY_TYPE = {
  url:          'url',
  phone_number: 'phone_number',
  copy_code:   'copy_code',
};

// const MOBILE_REGEX = /^[6-9]\d{9}$/;
// const LANDLINE_REGEX = /^0\d{8,11}$/;
// const PHONE_REGEX = /^(?:[6-9]\d{9}|0\d{8,11})$/;

const OVERALL_MAX_BUTTONS = 10;
const INDIAN_PHONE_REGEX =  /^\d{10}$/;
const URL_REGEX = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}\/?.*$/;

export default function Step3ButtonsScreen({navigation}){
    const [showActionButtonListModal, setShowActionButtonListModal]=useState(false)
    const [showActionButtonModal, setShowActionButtonModal]=useState(false)
    const [actionButtonText, setActionButtonText]=useState("")
    const [siteUrl, setSiteUrl]=useState("")
    const [phoneNumber, setPhoneNumber]=useState("")
    const [offerCode, setOfferCode]=useState("")
    const [selectedButtonActionType, setSelectedButtonActionType]=useState("")
    const [editIndex, setEditIndex] = useState(null);
    const [buttonTextErroMessage, setButtonTextErrorMessage]=useState('')
    const [phoneError, setPhoneError] = useState("");
    const [siteUrlError, setSiteUrlError] = useState("");
    
    
    
    const dispatch = useDispatch();
    const {isLoading, ctaButtons} = useSelector(s => s.templateWizardWhatsapp);
     const {whatsappAccessToken}=useSelector((state)=>state?.whatsappEmbedSingnup)

    // Compute count per type and overall disabled list
  const actionButtonsList = useMemo(() => {
    const countByType = ctaButtons.reduce((acc, btn) => {
      acc[btn.type] = (acc[btn.type] || 0) + 1;
      return acc;
    }, {});
    const overallDisabled = ctaButtons.length >= OVERALL_MAX_BUTTONS;

    return WhatsappTemplateActionButtonsList.map((btn) => {
      const reached = countByType[btn.actionType] >= btn.maximum;
      return { ...btn, isDisabled: overallDisabled || reached };
    });
  }, [ctaButtons]);

    const isAddButtonValid = !buttonTextErroMessage && actionButtonText.trim().length > 0 &&
        (selectedButtonActionType !== "PHONE_NUMBER" || (phoneNumber.trim().length === 10 && !phoneError)) &&
        (selectedButtonActionType !== "URL" || (siteUrl.trim().length > 0 && !siteUrlError)) &&
        (selectedButtonActionType !== "COPY_CODE" || (offerCode.trim().length > 0))

    const handleNext=()=>{
        // dispatch(nextStep())
        navigation.navigate('Preview');
    }
    const handleBack=()=>{
        dispatch(prevStep())
        // navigation.navigate('Preview');
    }

    const handleCreateTemplate=async()=>{
      
        try{
            const result=await dispatch(createTemplate(whatsappAccessToken))
            console.log(result, 'inside result')
            if( result && result==="token expired"){
                removeWhatsappUser()
                   await dispatch(resetWhatsappUser())
                    navigation.navigate('WhatsappSignupAdmin')
                    return
            }else if(result?.message==="Template created successfully" || result?.message==="Invalid parameter"){
                   await dispatch(resetWizard())
           navigation.navigate("WhatsappTemplateScreen")
            }
          
        return
        }catch(err){
            // toastShow(err.message)
            // Alert.alert('Error', err.message)
        }
        
    }

    const handleShowButtonListModal=()=>{
        setShowActionButtonListModal(true)
    }

    const handleCloseButtonListModal=()=>{
        setShowActionButtonListModal(false)
    }

    const renderHeaderActionButton = () => {
        return (
                <TouchableOpacity style={styles.headerActionButtonContainer} activeOpacity={0.8} onPress={handleShowButtonListModal}>
                    <View style={styles.actionButtonTextContainer}>
                        <Text style={[styles.actionButtonTitle, styles.headerActionButtonTextColor]}>{AddButtonsTextTitle}</Text>
                        <Text style={[styles.actionButtonSubTitle, styles.headerActionButtonTextColor]}>{AddButtonsTextSubtitle}</Text>
                    </View>
                    <PlusIconSvg width={rw(8)} height={rw(8)} color={colors.white} />
                </TouchableOpacity>
        )
    }

    const handleRenderActionButtonList=(button)=>{
        return(
            <View>
                <TouchableOpacity style={[styles.buttonListItem, button.isDisabled && styles.disableButtonListItem]} disabled={button.isDisabled} onPress={()=>handelShowActionButtonModal(button.actionType)}>
                    <View style={styles.buttonListItemTextContainer}>
                        <Text style={styles.buttonListItemLabel}>{button.label}</Text>
                       {button.maximumLabel && <Text style={styles.buttonListItemMaxLabel}>{button.maximumLabel}</Text>}
                    </View>
                    <SideArrowSvgIcon/>
                </TouchableOpacity>
                </View>
        )
    }

    const handelShowActionButtonModal=(actionType)=>{
               const defaultTextMap = {
                URL: "Visit website",
                PHONE_NUMBER: "Call Phone Number",
                COPY_CODE: "Copy Offer Code",
                QUICK_REPLY: "Quick Reply",
               };
        
            setActionButtonText(defaultTextMap[actionType] || "");
            setSelectedButtonActionType(actionType);
            setShowActionButtonListModal(false);
            setShowActionButtonModal(true);
    }

    const handleOpenEditButtonModal=(button, index)=>{
      setEditIndex(index);
      setSelectedButtonActionType(button.type);
      setActionButtonText(button.text);
      setSiteUrl(button.url    || '');
      if(button.phone_number){
        //  setPhoneNumber(button.phone_number.slice(2) || '');
         setPhoneNumber(button.phone_number.slice(2));
      }
      setOfferCode(button.copy_code    || '');
      setShowActionButtonModal(true);
    }

    const handleCloseShowActionButtonModal=()=>{
        setShowActionButtonModal(false)
        setSiteUrl('')
        setPhoneNumber('')
        setOfferCode('')
        setEditIndex(null)
        setButtonTextErrorMessage("")
        setPhoneError("")
    }

    useEffect(()=>{
             const normalized = actionButtonText.trim().toLowerCase();
        const duplicate = ctaButtons.some((btn, btnIndex) =>
            btn.text.trim().toLowerCase() === normalized && btnIndex !== editIndex
        );
        setButtonTextErrorMessage(duplicate ? "Each button text must be unique" : "");
    }, [actionButtonText, showActionButtonModal])

      useEffect(() => {
    if (selectedButtonActionType !== "PHONE_NUMBER") {
      setPhoneError("");
      return;
    }
    const digits = phoneNumber.replace(/\D/g, "").slice(0, 10);
    if (digits !== phoneNumber) setPhoneNumber(digits);
   
    setPhoneError(
      digits.length === 0 ? "" : INDIAN_PHONE_REGEX.test(digits) ? "" : "Enter a valid 10-digit Indian number"
    );
  }, [phoneNumber, selectedButtonActionType]);

  useEffect(() => {
    if (selectedButtonActionType !== "URL") {
      setSiteUrlError("");
      return;
    }
    const url = siteUrl.trim().toLowerCase();
    setSiteUrlError(
      url.length === 0
        ? ""
        : URL_REGEX.test(url)
        ? ""
        : "Enter a valid URL"
    );
  }, [siteUrl, selectedButtonActionType]);

    

    const handleAddButton=()=>{
        if(!isAddButtonValid) return
        // if(selectedButtonActionType==="COPY_CODE"){
        //     let newButton={
        //         type: selectedButtonActionType,
        //         example: offerCode
        //     }
        // dispatch(addButton(newButton))
        // handleCloseShowActionButtonModal()
        // return 
        // }
        let payload={
            type: selectedButtonActionType,
            text: actionButtonText.trim(),
            ...(selectedButtonActionType==="URL" ?{ url: siteUrl.trim().toLowerCase()}:{}),
            ...(selectedButtonActionType==="PHONE_NUMBER" ? {phone_number: `91${phoneNumber}`}: {}),
            ...(selectedButtonActionType==="COPY_CODE"? {copy_code: offerCode.trim()}:{})      
        }
        

        if (editIndex !== null) {
            dispatch(updateButton(editIndex, payload));
        } else {
            dispatch(addButton(payload));
        }

        handleCloseShowActionButtonModal();
    }

    const handleRemoveButton=(index)=>{
        dispatch(removeButton(index))
    }

    const renderShowButtonListModal=()=>{
        return (
            <ModalBottom
                title={AddButtonsTextTitle}
                open={showActionButtonListModal}
                onClose={handleCloseButtonListModal}
                sideMargin={0}
                style={{paddingVertical: 0}}
            >
                    <FlatList
                    style={styles.buttonListContainer}
                    scrollEnabled={false}
                    data={actionButtonsList}
                    renderItem={({item})=>handleRenderActionButtonList(item)}
                    keyExtractor={(item)=>item.id.toString()}
                    />

            </ModalBottom>
        )
    }

    const renderActionButtonModal=()=>{
        return(
            <TemplateWizardActionButtonModal 
            showActionButtonModal={showActionButtonModal} 
            handleCloseModal={handleCloseShowActionButtonModal} 
            modalTitle={`Button Action - ${selectedButtonActionType}`}
            buttonActionType={selectedButtonActionType}
            actionButtonText={actionButtonText}
            handleChangeActionButtonText={setActionButtonText}
            phoneNumber={phoneNumber}
            handleChangeButtonPhoneNumber={setPhoneNumber}
            siteUrl={siteUrl}
            handleChangeSiteUrl={setSiteUrl}
            offerCode={offerCode}
            handleChangeOfferCode={setOfferCode}
            addButton={handleAddButton}
            isEditing={editIndex !== null}
            buttonTextErroMessage={buttonTextErroMessage}
            isAddButtonEnable={!isAddButtonValid}
            phoneErrorMessage={phoneError}
            siteUrlErrorMessage={siteUrlError}
            />
        )
    }

    const AddedButton=React.memo(({button, index})=>{
            const fieldKey     = FIELD_BY_TYPE[button.type.toLowerCase()];
            const displayValue = fieldKey ? button[fieldKey] : null;
        return (
            <TouchableOpacity style={styles.addedButtonItemContainer} activeOpacity={0.8}>
                <View style={styles.buttonListItemTextContainer}> 
                    <Text style={styles.addedButtonItemTypeText}>{"Action - "}{button.type}</Text>
                    <Text style={styles.addedButtonItemLabel} numberOfLines={1}>{button.text}</Text>
                    {displayValue != null && (
                        <Text style={[styles.addedButtonItemLabel,styles.addedButtonItemMeta]} numberOfLines={1}>{displayValue}</Text>
                    )}
                </View>
                <View style={styles.addedButtonItemIconContainer}>
                    <View style={styles.editIconStyle}>
                    <TemplateEditIconSvg width={rw(6)} height={rw(6)} onIconPress={()=>handleOpenEditButtonModal(button, index)}/>
                    </View>
                    <TemplateDeleteIconSvg width={rw(6)} height={rw(6)} onIconPress={()=>handleRemoveButton(index)}/>
                </View>
            </TouchableOpacity>
        )
    })

     const handleRenderAddedButton = useCallback(
    ({ item, index }) => <AddedButton button={item} index={index}/>,
    [] 
  );

    const renderAddedButtonList=()=>{
        return(
            <FlatList
                data={ctaButtons}
                renderItem={handleRenderAddedButton}
                keyExtractor={(_, index)=>index.toString()}
                style={styles.buttonListItemTextContainer}
                showsVerticalScrollIndicator={false}
                bounces={false}
            />
        )
    }

    return(
        <>
        <View style={styles.container}>
            <View style={styles.content}>
                {renderHeaderActionButton()}
                {renderAddedButtonList()}
            </View>
     

                {/* <View style={styles.buttonContainer}> */}
                <TemplateWizardFooterButton showBack onBack={handleBack} onNext={handleNext} nextLabel="  Preview" />
                {/* </View> */}
                <TemplateWizardFooterButton showBack={false} onNext={handleCreateTemplate} nextLabel={isLoading ? "Loading..." : "Create Template"} />
        </View>
        {renderShowButtonListModal()}
        {renderActionButtonModal()}
        </>
    )
  
}

const styles=StyleSheet.create({
    container:{
        flex: 1,
        // justifyContent: 'space-between',
        // alignItems: 'center'
        // paddingHorizontal: rw(4),
        // backgroundColor: "#FFF"
    },
    content: {
        // paddingTop: rh(2),
        // paddingBottom: rh(30),
        flex: 1
    },
   
    buttonContainer:{
        // position: 'absolute',
        // bottom: 0,
        // alignSelf: 'flex-end'

    },
    headerActionButtonContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: rh(2),
        paddingHorizontal: rw(4),
        backgroundColor: '#585757',
        borderRadius: rw(3),
    },
    headerActionButtonTextColor:{
        color: colors.white
    },
    actionButtonTextContainer:{
        flex: 1,
        marginRight: rw(2)
    },
    actionButtonTitle:{
        fontSize: rf(2.5),
        fontWeight: '400',
        marginBottom: rh(0.8)
    },
    actionButtonSubTitle:{
        fontSize: rf(1.3),
    },
    actionButtonPlusIcon:{
        fontSize: rf(3)
    },
    buttonListItem:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: rh(1.3),
        paddingHorizontal: rw(1),
        // borderWidth: 1,
    },
    disableButtonListItem:{
        opacity: 0.3
    },
    buttonListItemTextContainer:{
        flex: 1,
    },
    buttonListItemLabel:{
        fontSize: rf(1.9),
        color: "#0A0614",
        fontWeight: '400',
        textAlign: 'left'
    },
    buttonListItemMaxLabel:{
        fontSize: rf(1.5),
        color: colors.WhatsappTemplateTextgreyColor,
        fontWeight: '300',
        textAlign: 'left'
    },
    buttonListContainer:{
        paddingVertical: rh(1.5),
    },
    addedButtonItemContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: rh(1.5),
        paddingHorizontal: rw(2.5),
        // borderWidth: 1,
        // borderColor: "white",
        
        shadowColor:"#27272721",
        backgroundColor: colors.white,
        shadowRadius: 0.1,
        shadowOffset:{width: 0, height: 1,},
        elevation: 3,
        borderRadius: rw(2),
        marginVertical: rh(1.5),
    },
    addedButtonItemIconContainer:{
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center',
        paddingHorizontal: rw(2),
    },
    editIconStyle:{
        marginRight: rw(2.5)
    },
    addedButtonItemTypeText:{
        fontSize: rf(2),
        color: "#181818",
        fontWeight: '400'
    },
    addedButtonItemLabel:{
        fontSize: rf(1.6),
        color: colors.callGroupIcon,
        fontWeight: '400'
    },
    addedButtonItemMeta:{
        fontSize: rf(1.4)
    }

})