// src/store/selectors/templateWizard.js
export const selectStep = state => state.templateWizardWhatsapp.step;

export const selectIsStep1Valid = state => {
  const { name, language, headerType, bodyText, mediaFiles } = state.templateWizardWhatsapp;
  if (!name.trim() || !language) return false;
  return headerType === 'Text'
    ? Boolean(bodyText && bodyText.trim().length > 0)
    : mediaFiles.length > 0;
};

export const selectIsStep2Valid = state => {
  const { ctaButtons } = state.templateWizardWhatsapp;
  // buttons must all have both type and label
  return ctaButtons.length > 0 && ctaButtons.every(btn => btn.type && btn.label);
};

export const selectIsStep3Valid = state => {
  const { ctaButtons, buttonLabels } = state.templateWizardWhatsapp;
  // ensure every button from step 2 has a matching, non-empty label in step 3
  return ctaButtons.every((_, i) => Boolean(buttonLabels[i]?.trim()));
};


export const selectWizardState = state => {
  const wizard = state.templateWizardWhatsapp;
  return {
    name:       wizard.name,
    language:   wizard.language,
    headerType: wizard.headerType,    // e.g. 'text'|'image'|'none'
    headerData: wizard.headerData,    // the actual header string (if any)
    headerMedia: wizard.headerMedia,
    bodyText:   wizard.bodyText,      // markdown/raw body
    footerText: wizard.footerText,    // optional footer
    ctaButtons: wizard.ctaButtons,    // array of { type, label, payload }
   
    headerUploadedMediaToken: wizard.headerUploadedMediaToken
  };
};