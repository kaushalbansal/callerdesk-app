
import { GET_ANALYTICS_DATA_END_POINT } from "../../Constants";
import { toastShow } from "../../helpers/utils";
import { Analytics } from "../action-consts";


export const analyticsDataRequest = () => ({
  type: Analytics.GET_ANALYTICS_REQUEST,
});

export const analyticsDataSuccess = (data) => ({
  type: Analytics.GET_ANALYTICS_SUCCESS,
  payload: data,
});

export const stopLoading = () => ({
  type: Analytics.GET_ANALYTICS_STOP_LOADING,
});


export const getAnalyticsData = (authcode) => {
  return async (dispatch) => {
    dispatch(analyticsDataRequest());
    try {
      const formData = new FormData();
      formData.append("authcode", authcode);

      const response = await fetch(GET_ANALYTICS_DATA_END_POINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toastShow("Unable to get analytics data, please try again later");
        return;
      }
     

      const data = await response.json();
        if(data.type==='error'){
        toastShow(data.message);
        return
      }
      dispatch(analyticsDataSuccess(data));
      return data;
    } catch (error) {
      toastShow(error.message);
    } finally {
      dispatch(stopLoading());
    }
  };
};
