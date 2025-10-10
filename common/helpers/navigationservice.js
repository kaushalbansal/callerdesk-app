// NavigationService.js
import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function reset(routes = [], index = 0) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
}
export function getCurrentScreen() {
  if (navigationRef.isReady()) {
    const route = navigationRef.getCurrentRoute();
    return route ? route.name : null;
  }
  return null;
}
