import { ConstCallDetailsScreen, ConstScreens } from '../action-consts';

const initState = ConstCallDetailsScreen;

const groupDetailsScreen = (state = initState, action) => {
  switch (action.type) {
    case ConstScreens.GROUP_DETAILS_SCREEN: {
      const data = action.payload;
      return {
        call_strategy: data.call_strategy ? data.call_strategy : ``,
        desk_phone: data.desk_phone ? data.desk_phone : ``,
        deskphone_id: data.deskphone_id ? data.deskphone_id : ``,
        extension: data.extension ? data.extension : ``,
        group_extn: data.group_extn ? data.group_extn : ``,
        group_id: data.group_id ? data.group_id : ``,
        group_name: data.group_name ? data.group_name : ``,
        group_owner_name: data.group_owner_name ? data.group_owner_name : ``,
        groupmember_count: data.groupmember_count ? data.groupmember_count : ``,
        is_multi_sticky: data.is_multi_sticky ? data.is_multi_sticky : ``,
        is_sticky: data.is_sticky ? data.is_sticky : ``,
        time_schedule: data.time_schedule ? data.time_schedule : ``,
      };
    }
    default:
      return state;
  }
};

export default groupDetailsScreen;
