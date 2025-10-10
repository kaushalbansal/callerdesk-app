import { Analytics } from "../action-consts";

const initialState={
    isLoading: false,
    answer_hourly:[],
    noanswer_hourly:[],
    answer_daily:[],
    noanswer_daily:[],
    date_daily:[],
    time_hourly:[],
    user_traffic: [],
    monthly_calls_regionwise: []
}

const analyticsReducer=(state=initialState, action)=>{
    switch(action.type){
        case Analytics.GET_ANALYTICS_REQUEST:
            return {...state, isLoading: true};
        case Analytics.GET_ANALYTICS_SUCCESS:
            return {
                ...state, isLoading: false,
                 answer_hourly: action.payload.answer_hourly,
                 noanswer_hourly: action.payload.noanswer_hourly,
                 answer_daily: action.payload.answer_daily,
                 noanswer_daily: action.payload.noanswer_daily,
                 date_daily: action.payload.date_daily,
                 time_hourly: action.payload.time_hourly,
                 user_traffic: action.payload.user_traffic,
                 monthly_calls_regionwise: action.payload.monthly_calls_regionwise
            }
        case Analytics.GET_ANALYTICS_STOP_LOADING:
            return {...state, isLoading: false};
            
        default: return state;
   }
}

export default analyticsReducer