// import colors from './colors';
// import layouts from './layouts';

import { css } from "@emotion/react";

// const mainButton = css`
//     cursor: pointer;
//     color: ${props => props.theme.colors.mainThemeColor};
//     border: .1rem solid ${props => props.theme.colors.mainThemeColor};
//     border-radius: .3rem;
//     padding: .8rem;
// `;

// const viewer = css`
//   background-color:${props => props.theme.colors.whiteColor};
//   flex: 0.5 1 0%;
//   display: inline-block;
//   word-break: break-word;
//   overflow-y: scroll;
//   -ms-overflow-style: none;

//   @media screen and (max-width: ${layouts.mobileWidth}) {
//     width: 100%;
//     padding-left: 1.6rem;
//     padding-right: 1.6rem;
//   }
// `;

// export default {
//   mainButton,
//   viewer,
// };

export const invisibleScrollBar = css`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
