import { keyframes } from "@emotion/react";

const loading = keyframes`
  0% {
    background-color: hsl(0,0%,89%);
  }
  50% {
    background-color: hsl(0,0%,85%);
  }
  100% {
    background-color: hsl(0,0%,89%);
  }
`;

export default {
  loading,
};
