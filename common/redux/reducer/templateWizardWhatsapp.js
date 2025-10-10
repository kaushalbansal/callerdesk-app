import { TemplateWizardWhatsapp } from "../action-consts";

  const initialState = {
    step:       1,
    name:       '',
    language:   {label: "English", value: "en"},
    headerType:  'NONE',    // or 'Media'
    headerData: '',
    headerMedia: null,
    headerUploadedMediaToken: '',
    bodyText:   '',
    mediaFiles: [],        // array of { uri, name, ... }
    footerText: '',
    ctaButtons: [],        // array of { type, label, payload }
    buttonLabels: [],      // for step 3 final labels
  
    isLoading: false,
    error: null
  };
  
  export default function templateWizardWhatsappReducer(state = initialState, action) {
    switch (action.type) {
      case TemplateWizardWhatsapp.CREATE_TEMPLATE_REQUEST:
        return {...state, isLoading: true, error: null}
      
      case TemplateWizardWhatsapp.CREATE_TEMPLATE_SUCCESS: 
        return {...state, isLoading: false}

      case TemplateWizardWhatsapp.CREATE_TEMPLATE_FAILURE: 
        return {...state, isLoading: false, error: action.error}  
      
      case TemplateWizardWhatsapp.NEXT_STEP:
        return { ...state, step: Math.min(state.step + 1, 4) };

      case TemplateWizardWhatsapp.PREV_STEP:
        return { ...state, step: Math.max(state.step - 1, 1) };
        
      case TemplateWizardWhatsapp.RESET_WIZARD:
        return initialState;

      case TemplateWizardWhatsapp.SET_NAME:
        return { ...state, name: action.payload };

      case TemplateWizardWhatsapp.SET_LANGUAGE:
        return { ...state, language: action.payload };

      case TemplateWizardWhatsapp.SET_HEADER_TYPE:
        return {...state, headerType: action.payload }

      case TemplateWizardWhatsapp.SET_HEADER_CONTENT: 
        return {...state, headerData: action.payload,}

      case TemplateWizardWhatsapp.SET_HEADER_MEDIA: 
        return {...state, headerMedia: action.payload.media,  headerUploadedMediaToken: action.payload.mediaToken,}

      case TemplateWizardWhatsapp.SET_BODY_TEXT:
        return {...state, bodyText: action.payload}

        
      case TemplateWizardWhatsapp.SET_FOOTER:
        return {...state, footerText: action.payload}

    case TemplateWizardWhatsapp.ADD_IMAGE:
      return { 
        ...state,
        mediaFiles: [...state.mediaFiles, action.payload] 
      };

    case TemplateWizardWhatsapp.REMOVE_IMAGE:
      return {
        ...state,
        mediaFiles: state.mediaFiles.filter((_, i) => i !== action.payload)
      };

    case TemplateWizardWhatsapp.ADD_BUTTON:
      return {
        ...state,
        ctaButtons: [...state.ctaButtons, action.payload]
      };

    case TemplateWizardWhatsapp.REMOVE_BUTTON:
      return {
        ...state,
        ctaButtons: state.ctaButtons.filter((_, i) => i !== action.payload)
      };


    case TemplateWizardWhatsapp.UPDATE_BUTTON: {
      const { index, newData } = action.payload;
      return {
        ...state,
        ctaButtons: state.ctaButtons.map((btn, i) =>
          i === index ? { ...btn, ...newData } : btn
        ),
      };
    }
      
    
      case TemplateWizardWhatsapp.SET_BTN_LABEL:
        return{
            ...state,
            buttonLabels:  state.buttonLabels.map((v, i)=>v[action.payload.index]=action.payload.label)
        }

              
      default:
        return state;
    }
  }
  