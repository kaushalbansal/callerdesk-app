import { ConstCallResultAnalysisScreen, ConstScreens } from '../action-consts';

const initState = ConstCallResultAnalysisScreen;

const callResultAnalysis = (state = initState, action) => {
  switch (action.type) {
    case ConstScreens.LOAD_CALL_RESULT_ANALYSIS: {
      const data = action.payload;
      return {
        total_call: data.total_call,
        total_duration: data.total_call,
        missed_calls: data.missed_calls,
        unique_calls: data.unique_calls,
        voice_mail: data.voice_mail,
        engaged_calls: data.engaged_calls,
        dataArr: data.dataArr,
        call_analytics_data: data.call_analytics_data,
      };
    }
    default:
      return state;
  }
};

export default callResultAnalysis;
