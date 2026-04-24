export const startViewTransition = (callback: () => void) => {
  if (!document.startViewTransition) {
    console.log('View transitions are not supported in this browser.');
    callback();
    return;
  } else {
    document.startViewTransition(callback);
  }
};
