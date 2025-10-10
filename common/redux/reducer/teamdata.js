import { ConstScreens, ConstTeamMemberDataScreen } from '../action-consts';

const initState = ConstTeamMemberDataScreen;

const teamMemberDataScreen = (state = initState, action) => {
  switch (action.type) {
    case ConstScreens.TEAM_MEMBER_DATA_SCREEN: {
      return {
        member_name: '',
        member_num: '',
      };
    }
    default:
      return state;
  }
};

export default teamMemberDataScreen;
