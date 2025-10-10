import { ConstContactDetailsScreen, ConstScreens } from '../action-consts';

const initState = ConstContactDetailsScreen;

const contactDetailsScreen = (state = initState, action) => {
  switch (action.type) {
    case ConstScreens.CONTACT_DETAILS_SCREEN: {
      const data = action.payload;
      return {
        company_name: data.company_name ? data.company_name : ``,
        contact_address: data.contact_address ? data.contact_address : ``,
        contact_comment: data.contact_comment ? data.contact_comment : ``,
        contact_email: data.contact_email ? data.contact_email : ``,
        contact_followupdate: data.contact_followupdate
          ? data.contact_followupdate
          : ``,
        contact_followuptime: data.contact_followuptime
          ? data.contact_followuptime
          : ``,
        contact_id: data.contact_id ? data.contact_id : ``,
        contact_name: data.contact_name ? data.contact_name : ``,
        contact_num: data.contact_num ? data.contact_num : ``,
        contact_num_unmask: data.contact_num_unmask
          ? data.contact_num_unmask
          : ``,
        contact_savedate: data.contact_savedate ? data.contact_savedate : ``,
        contact_status: data.contact_status ? data.contact_status : ``,
        deskphone: data.deskphone ? data.deskphone : ``,
        member_name: data.member_name ? data.member_name : ``,
      };
    }
    default:
      return state;
  }
};

export default contactDetailsScreen;
