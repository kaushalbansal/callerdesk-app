import { ConstHomeScreen, ConstScreens } from '../action-consts';

const initState = ConstHomeScreen;

const homeScreenData = (state = initState, action) => {
  switch (action.type) {
    case ConstScreens.LOAD_HOME_SCREEN: {
      const data = action.payload;
      return {
        active_members: data.active_members,
        answered: data.answered,
        average_talk_time: data.average_talk_time,
        block_users: data.block_users,
        inactive_members: data.inactive_members,
        member_analysis: data.member_analysis,
        noanswer: data.noanswer,
        noanswer_details: data.noanswer_details,
        queue_duration: data.queue_duration,
        talk_duration: data.talk_duration,
        total_calls: data.total_calls,
        total_groups: data.total_groups,
        total_members: data.total_members,
        unique_calls: data.unique_calls,
        voicemail: data.voicemail,
      };
    }
    default:
      return state;
  }
};

export default homeScreenData;
