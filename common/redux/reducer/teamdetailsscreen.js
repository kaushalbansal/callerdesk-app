import { ConstScreens, ConstTeamDetailsScreen } from '../action-consts';

const initState = ConstTeamDetailsScreen;

const teamDetailsScreen = (state = initState, action) => {
  switch (action.type) {
    case ConstScreens.TEAM_DETAILS_SCREEN: {
      const data = action.payload;
      return {
        access: data.access ? data.access : '',
        agent_extn: data.agent_extn ? data.agent_extn : '',
        member_email: data.member_email ? data.member_email : '',
        member_id: data.member_id ? data.member_id : '',
        member_name: data.member_name ? data.member_name : '',
        member_num: data.member_num ? data.member_num : '',
        password: data.password ? data.password : '',
        status: data.status ? data.status : '',
        type: data.type ? data.type : '',
      };
    }
    default:
      return state;
  }
};

export default teamDetailsScreen;
