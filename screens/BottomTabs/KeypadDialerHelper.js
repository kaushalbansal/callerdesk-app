import KeypadDialerModule from '../../KeypadDialerModule';
export const openKeypadDialer = async (dispatch, user, d1, d2) => {
  try {
    const callerid = user.appcall_routing_did;
    const callerid1 = 0 + user.appcall_routing_did.substr(callerid.length - 10);
    const response = await KeypadDialerModule.openKeypadDialer(
      callerid1,
      user.mobile_no,
      user.authcode,
      d1,
      d2,
    );
  } catch (error) {
    console.log('close: ' + error.message);
  }
};
