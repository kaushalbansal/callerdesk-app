import { openKeypadDialer } from '../../screens/BottomTabs/KeypadDialerHelper';
export const handleOpenKeypadDialer = (
  dispatch,
  role,
  setShowDiler,
  user,
  d1,
  d2,
) => {
  checkRole(dispatch, role, setShowDiler, user, d1, d2);
};
const checkRole = (dispatch, role, setShowDiler, user, d1, d2) => {
  if (role === '1' || role === '2') {
    setShowDiler(true);
  } else {
    setShowDiler(false);
    openKeypadDialer(dispatch, user, d1, d2);
  }
};
