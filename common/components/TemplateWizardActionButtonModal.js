import React from 'react';
import { StyleSheet, View } from "react-native";
import ModalMid from "./ModalMid";
import PropTypes from "prop-types";
import TemplateWizardInput from "./TemplateWizardInput";
import TemplateWizardFooterButton from "./TemplateWizardFooterButton";
import { rh, rw } from '../helpers/dimentions';

function TemplateWIzardActionButtonModal({
    showActionButtonModal,
    handleCloseModal,
    modalTitle,
    actionButtonText,
    handleChangeActionButtonText,
    buttonActionType,
    siteUrl,
    handleChangeSiteUrl,
    phoneNumber,
    handleChangeButtonPhoneNumber,
    offerCode,
    handleChangeOfferCode,
    addButton,
    isEditing,
    buttonTextErroMessage,
    phoneErrorMessage,
    isAddButtonEnable,
    siteUrlErrorMessage
}) {

    const renderButtonTextInput = () => {
        return (
            <TemplateWizardInput
                value={actionButtonText}
                onChangeText={handleChangeActionButtonText}
                placeholder={'write your button text here'}
                maxLength={25}
                //    multiline
                label={"Button Text"}
                error={buttonTextErroMessage}
            //    containerStyle={styles.nameInputContainer}
            />
        )
    }

    const renderWebSiteActionButtonContent = () => {
        return (
            <View style={styles.bodyContainer}>
                <TemplateWizardInput
                    value={"Static"}
                    inputEnabled={false}
                    label={"URL type"}
                />
                {renderButtonTextInput()}
                <TemplateWizardInput
                    label={"Website URL"}
                    maxLength={2000}
                    multiline
                    value={siteUrl}
                    onChangeText={handleChangeSiteUrl}
                    placeholder={"https://"}
                    error={siteUrlErrorMessage}
                    autoCapitalize={"none"}
                />
            </View>
        )
    }

    const renderPhoneNumberActionButtonContent = () => {
        return (
            <View style={styles.bodyContainer}>
                <TemplateWizardInput
                    value={"IN +91"}
                    inputEnabled={false}
                    label={"Country"}
                />
                {renderButtonTextInput()}
                <TemplateWizardInput
                    label={"Phone Number"}
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={handleChangeButtonPhoneNumber}
                    placeholder={"Enter phone number"}
                    keyBoardType='number-pad'
                    error={phoneErrorMessage}
                />
            </View>
        )
    }

    const renderCopyOfferCodeActionButtonContent = () => {
        return (
            <View style={styles.bodyContainer}>
                <TemplateWizardInput
                    value={"Copy offer code"}
                    inputEnabled={false}
                    label={"Button Text"}
                />
                <TemplateWizardInput
                    label={"Offer Code"}
                    maxLength={15}
                    value={offerCode}
                    onChangeText={handleChangeOfferCode}
                    placeholder={"Enter sample"}
                // error={""}
                />
            </View>
        )
    }

    const renderQuickReplyActionButtonContent = () => {
        return (
            <View style={styles.bodyContainer}>
                {renderButtonTextInput()}
            </View>
        )
    }

    function renderModalContent() {
        switch (buttonActionType) {
            case "URL":
                return renderWebSiteActionButtonContent()
            case "PHONE_NUMBER":
                return renderPhoneNumberActionButtonContent()
            case "COPY_CODE":
                return renderCopyOfferCodeActionButtonContent()
            default:
                return renderQuickReplyActionButtonContent()
        }
    }

    return (
        <ModalMid
            title={modalTitle}
            open={showActionButtonModal}
            onClose={handleCloseModal}
            scrollViewkeyboardShouldPersistTaps={'handled'}
        >
            <View>
                {renderModalContent()}
                <TemplateWizardFooterButton showBack={false} onNext={addButton} nextLabel={isEditing ? "Edit" : "Add"} disableNext={isAddButtonEnable} />
            </View>
        </ModalMid>
    )
}


const styles = StyleSheet.create({
    bodyContainer: {
        marginTop: rh(2),
        width: '100%',
        paddingHorizontal: rw(4),
        paddingVertical: rh(1.5),
        paddingBottom: rh(1.8),
        paddingTop: 0,
        borderWidth: 1,
        borderColor: '#E1DDDD',
        borderRadius: rw(3),
        marginBottom: rh(1)
    }
})


TemplateWIzardActionButtonModal.propTypes = {
    showActionButtonModal: PropTypes.bool,
    handleCloseModal: PropTypes.func,
    modalTitle: PropTypes.string,
    actionButtonText: PropTypes.string,
    handleChangeActionButtonText: PropTypes.func,
    buttonActionType: PropTypes.string,
    siteUrl: PropTypes.string,
    handleChangeSiteUrl: PropTypes.func,
    phoneNumber: PropTypes.string,
    handleChangeButtonPhoneNumber: PropTypes.func,
    offerCode: PropTypes.string,
    handleChangeOfferCode: PropTypes.func,
    addButton: PropTypes.func,
    isEditing: PropTypes.bool,
    buttonTextErroMessage: PropTypes.string,
    phoneErrorMessage: PropTypes.string,
    siteUrlErrorMessage: PropTypes.string,
    isAddButtonEnable: PropTypes.bool,
}

export default React.memo(TemplateWIzardActionButtonModal)