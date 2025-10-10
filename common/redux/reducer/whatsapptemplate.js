import { WhatsAppTemplate } from '../action-consts';

const initState = {
  waTempList: [],
};

const whatsappTemplate = (state = initState, action) => {
  switch (action.type) {
    case WhatsAppTemplate.LOAD_WHATSAPP_TEMPLATE: {
      const { data } = action.payload;
      return { ...state, waTempList: data.whatsapp_template };
    }
    default:
      return state;
  }
};

export default whatsappTemplate;
