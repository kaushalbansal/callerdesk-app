global.__reportException = (e) => {
  try {
    console.error('Global JS exception', e && e.stack ? e.stack : e);
  } catch (err) {
    console.error('error logging exception', err);
  }
};

// hook into global error handling (dev only)
if (__DEV__) {
  const originalHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    __reportException(error);
    if (originalHandler) originalHandler(error, isFatal);
  });
}
