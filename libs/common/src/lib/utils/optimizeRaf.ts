export const optimizeRaf = (cb: () => void) => {
  let ticking = false;

  return () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        cb();
        ticking = false;
      });
    }
  };
};
