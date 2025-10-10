import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import globalReducer from './reducer/global';
import contactReducer from './reducer/contact';
import callLogReducer from './reducer/callLog';
import voiceTemplateReducer from './reducer/voiceTemplate';
import contactHistoryReducer from './reducer/contacthistory';
import homeScreenReducer from './reducer/homescreendata';
import callResultAnalysisReducer from './reducer/callresultanalysis';
import contactDetailsScreenReducer from './reducer/contactdetailsscreen';
import teamDetailsScreen from './reducer/teamdetailsscreen';
import groupDetailsScreen from './reducer/group';
import whatsappTemplate from './reducer/whatsapptemplate';
import BreakReducer from './reducer/break';
import EntryReducer from './reducer/entry';
import analyticsReducer from './reducer/analyticsReducer';
import templateWizardWhatsappReducer from './reducer/templateWizardWhatsapp';
import whatsappEmbedSignupReducer from './reducer/whatsappEmbedSignup';

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  global: globalReducer,
  contact: contactReducer,
  group: groupDetailsScreen,
  homeScreen: homeScreenReducer,
  callResultAnalysis: callResultAnalysisReducer,
  contactDetails: contactDetailsScreenReducer,
  teamDetails: teamDetailsScreen,
  contactHistory: contactHistoryReducer,
  callLog: callLogReducer,
  voiceTemplate: voiceTemplateReducer,
  whatsappTemplate,
  breakReducer: BreakReducer,
  entryReducer: EntryReducer,
  analytics: analyticsReducer,
  templateWizardWhatsapp: templateWizardWhatsappReducer,
  whatsappEmbedSingnup: whatsappEmbedSignupReducer,
});

// Configure and create the Redux store with thunk middleware
const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};

const store = configureStore();
export default store;
