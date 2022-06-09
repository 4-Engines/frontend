import { breakpointsVuetify, useBreakpoints } from '@vueuse/core';

function useMobile() {
  const breakpoints = useBreakpoints(breakpointsVuetify);

  return {
    isMobile: breakpoints.smaller('xs'),
  };
}

export { useMobile };
