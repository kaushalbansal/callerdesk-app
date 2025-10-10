import { WhatsappEmbedSignup } from "../action-consts";


const initialState={
    isLoading: false,
    isTemplatesListLoading: false,
    loadingMessage: "",
    error: null,
    whatsappAccessToken: null,
    whatsappRefreshToken: null,
    whatsappIntegration: false,
    whatsappTemplatesList: [],
    totalPages: 1,
}

export default function whatsappEmbedSignupReducer(state=initialState, action) {
    switch (action.type) {
        case WhatsappEmbedSignup.LOAD_WHATSAPP_SIGNUP:
            return {...state, isLoading: true, loadingMessage: action.payload};
        case WhatsappEmbedSignup.STOP_LOADING_WHATSAPP_SIGNUP:
            return {...state, isLoading: false, loadingMessage: ""};
        case WhatsappEmbedSignup.VERIFY_OTP_SUCCESS_WHATSAPP_LOGIN:
            console.log(action.payload, 'action payload')
            return {...state, isLoading: false, whatsappAccessToken: action.payload.whatsappAccessToken, whatsappRefreshToken: action.payload.whatsappRefreshToken, whatsappIntegration: action.payload.whatsappIntegration };
        case WhatsappEmbedSignup.UPDATE_USER_EMBED_SIGNUP_INTEGRATION_STATUS:
            return {...state, whatsappIntegration: true, isLoading: false };
        case WhatsappEmbedSignup.SET_WHATSAPP_TEMPLATES_LIST:
            return {...state, whatsappTemplatesList: action.payload, isLoading: false };
        case WhatsappEmbedSignup.LOAD_TEMPLATES_LIST:
            return {...state, isTemplatesListLoading: true};
        case WhatsappEmbedSignup.STOP_LOADING_TEMPLATES_LIST:
            return {...state, isTemplatesListLoading: false};
        case WhatsappEmbedSignup.SET_TOTAL_PAGES:
            return {...state, totalPages: action.payload};
        case WhatsappEmbedSignup.HYDRATE_WHATSAPP_USER:
            console.log('hydrating user', action.payload);
            return {
                ...state,
                whatsappAccessToken: action.payload.whatsappAccessToken,
                whatsappRefreshToken: action.payload.whatsappRefreshToken,
                whatsappIntegration: action.payload.whatsappIntegration,
            };
        case WhatsappEmbedSignup.RESET_WHATSAPP_USER:
            console.log('removing from redux====>')
            return initialState
        default:
            return state;
    }
}