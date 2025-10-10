import { CallAnalyticsCallData, CallAnalyticsData } from '../Constants';

export const ConstGlobal = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  DEFAULT_DATE: 'DEFAULT_DATE',
  LOGOUT: 'LOGOUT',
  LOADING_START: 'LOADING_START',
  LOADING_STOP: 'LOADING_STOP',
  LOADING_TOGGLE: 'LOADING_TOGGLE',
  PROFILE_BALANCE_SUCCESS: 'PROFILE_BALANCE_SUCCESS',
  SAVE_DIALER_MODE: 'SAVE_DIALER_MODE',
};
export const ConstContact = {
  LOAD_LIST: 'LOAD_LIST',
  LOAD_SAVED_CONTACT_LIST: 'LOAD_SAVED_CONTACT_LIST',
  LOAD_HISTORY: 'LOAD_HISTORY',
  LOAD_GROUP: 'LOAD_GROUP',
};
export const ConstScreens = {
  LOAD_HOME_SCREEN: 'LOAD_HOME_SCREEN',
  LOAD_CALL_RESULT_ANALYSIS: 'LOAD_CALL_RESULT_ANALYSIS',
  CONTACT_DETAILS_SCREEN: 'CONTACT_DETAILS_SCREEN',
  TEAM_DETAILS_SCREEN: 'TEAM_DETAILS_SCREEN',
  TEAM_MEMBER_DATA_SCREEN: 'TEAM_MEMBER_DATA_SCREEN',
  GROUP_DETAILS_SCREEN: 'GROUP_DETAILS_SCREEN',
};

export const ConstCalllog = {
  LOAD_LIST: 'LOAD_CALL_LOG_LIST',
  LOG_STATUS: 'LOG_STATUS',
  LOAD_APP_CALL_LIST: 'LOAD_APP_CALL_LIST',
  IVR_LIST: 'IVR_LIST',
  HOME_PAGE_SUMMARY: 'HOME_PAGE_SUMMARY',
  BLOCK_UNBLOCK_SUCCESS: 'BLOCK_UNBLOCK_SUCCESS',
  MEM_LIST: 'MEM_LIST',
  ROUTING_LIST: 'ROUTING_LIST',
  CLEAR_ROUTING_LIST: 'CLEAR_ROUTING_LIST',
  BLOCK_LIST: 'BLOCK_LIST',
  MEMBER_STATUS_UPDATE: 'MEMBER_STATUS_UPDATE',
  GET_SIM_CALL_LOG: 'GET_SIM_CALL_LOG',
  SET_SIM_CALL_LOG_FILTERS: 'SET_SIM_CALL_LOG_FILTERS',
  SET_SIM_CALL_LOG_META: 'SET_SIM_CALL_LOG_META',
};

export const ConstVoiceList = {
  LOAD_VOICE_TEMPLATE: 'LOAD_VOICE_TEMPLATE',
  LOAD_CALLGROUP_LIST: 'LOAD_CALLGROUP_LIST',
};
export const BreakApi = {
  STATUS: 'STATUS',
};
export const EntryApi = {
  STATUS_ENTRY: 'STATUS_ENTRY',
};
export const Analytics={
  GET_ANALYTICS_REQUEST: 'GET_ANALYTICS_REQUEST',
  GET_ANALYTICS_SUCCESS: 'GET_ANALYTICS_SUCCESS',
  GET_ANALYTICS_STOP_LOADING: 'GET_ANALYTICS_STOP_LOADING',
}
export const WhatsAppTemplate = {
  LOAD_WHATSAPP_TEMPLATE: 'LOAD_WHATSAPP_TEMPLATE',
  ADD_WHATSAPP_TEMPLATE: 'ADD_WHATSAPP_TEMPLATE',
  UPDATE_WHATSAPP_TEMPLATE: 'UPDATE_WHATSAPP_TEMPLATE',
};
export const WhatsappEmbedSignup={
   LOAD_WHATSAPP_SIGNUP: 'LOAD_WHATSAPP_SIGNUP',
   STOP_LOADING_WHATSAPP_SIGNUP: "STOP_LOADING_WHATSAPP_SIGNUP",
   REGISTER_WHATSAPP: "REGISTER_WHATSAPP",
   LOGIN_WHATSAPP: "LOGIN_WHATSAPP",
   VERIFY_OTP_SUCCESS_WHATSAPP_LOGIN: "VERIFY_OTP_SUCCESS_WHATSAPP_LOGIN",
   UPDATE_USER_EMBED_SIGNUP_INTEGRATION_STATUS: "UPDATE_USER_EMBED_SIGNUP_INTEGRATION_STATUS",
   SET_WHATSAPP_TEMPLATES_LIST: "SET_WHATSAPP_TEMPLATES_LIST",
   LOAD_TEMPLATES_LIST: 'LOAD_TEMPLATES_LIST',
   STOP_LOADING_TEMPLATES_LIST: "STOP_LOADING_TEMPLATES_LIST",
   HYDRATE_WHATSAPP_USER: "HYDRATE_WHATSAPP_USER",
   RESET_WHATSAPP_USER: "RESET_WHATSAPP_USER",
   SET_TOTAL_PAGES: "SET_TOTAL_PAGES"
}
export const TemplateWizardWhatsapp={
 NEXT_STEP     : 'NEXT_STEP',
 PREV_STEP     : 'PREV_STEP',
 RESET_WIZARD  : 'RESET_WIZARD',
 SET_NAME      : 'SET_NAME',
 SET_LANGUAGE  : 'SET_LANGUAGE',
 SET_HEADER_TYPE: 'SET_HEADER_TYPE',
 SET_HEADER_CONTENT: 'SET_HEADER_CONTENT',
 SET_HEADER_MEDIA: 'SET_HEADER_MEDIA',
 SET_BODY_TEXT : 'SET_BODY_TEXT',
 SET_FOOTER    : 'SET_FOOTER',
 ADD_IMAGE     : 'ADD_IMAGE',
 REMOVE_IMAGE  : 'REMOVE_IMAGE',
 ADD_BUTTON    : 'ADD_BUTTON',
 REMOVE_BUTTON : 'REMOVE_BUTTON',
 UPDATE_BUTTON: "UPDATE_BUTTON",
 SET_BTN_LABEL : 'SET_BTN_LABEL',
 CREATE_TEMPLATE_REQUEST: "CREATE_TEMPLATE_REQUEST",
 CREATE_TEMPLATE_SUCCESS: "CREATE_TEMPLATE_SUCCESS",
 CREATE_TEMPLATE_FAILURE: "CREATE_TEMPLATE_FAILURE",
}
export const ConstHomeScreen = {
  active_members: 0,
  answered: 0,
  average_talk_time: 0,
  block_users: 0,
  inactive_members: 0,
  member_analysis: [],
  noanswer: 0,
  noanswer_details: [],
  queue_duration: 0,
  talk_duration: 0,
  total_calls: 0,
  total_groups: 0,
  total_members: 0,
  unique_calls: 0,
  voicemail: 0,
};
export const ConstCallResultAnalysisScreen = {
  total_call: 0,
  total_duration: 0,
  missed_calls: 0,
  unique_calls: 0,
  voice_mail: 0,
  engaged_calls: 0,
  dataArr: CallAnalyticsData,
  call_analytics_data: CallAnalyticsCallData,
};
export const ConstContactDetailsScreen = {
  company_name: '',
  contact_address: '',
  contact_comment: '',
  contact_email: '',
  contact_followupdate: '',
  contact_followuptime: '',
  contact_id: '',
  contact_name: '',
  contact_num: '',
  contact_num_unmask: '',
  contact_savedate: '',
  contact_status: '',
  deskphone: '',
  member_name: '',
};
export const ConstTeamDetailsScreen = {
  access: '',
  agent_extn: '',
  member_email: '',
  member_id: '',
  member_name: '',
  member_num: '',
  password: '',
  status: '',
  type: '',
};
export const ConstTeamMemberDataScreen = {
  member_name: '',
  member_num: '',
};
export const ConstCallDetailsScreen = {
  call_strategy: ``,
  deskphone_id: '',
  extension: '',
  group_extn: '',
  group_id: '',
  group_name: '',
  group_owner_name: ``,
  groupmember_count: 0,
  is_multi_sticky: '',
  is_sticky: '',
  time_schedule: 0,
};
export const ConstCallResultAnalysisScreenInitial = {
  total_call: 0,
  total_duration: 0,
  missed_calls: 0,
  unique_calls: 0,
  voice_mail: 0,
  engaged_calls: 0,
  dataArr: {},
  call_analytics_data: [],
};
