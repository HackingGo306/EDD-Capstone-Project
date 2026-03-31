"use client";

const SERVER = process.env.NEXT_PUBLIC_SERVER;
const NEXT_SERVER = process.env.NEXT_PUBLIC_NEXT_SERVER;
const CK_EDITOR_LICENSE_KEY = process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;

import { createTheme } from '@mui/material/styles';

const CUSTOM_THEME = createTheme({
  palette: {
    primary: {
      main: '#E0B0FF',
    },
    secondary: {
      main: '#84ACC9',
    },
    tertiary: {
      main: 'rgba(239, 161, 183, 1)'
    },
    text: {
      primary: '#344552',
      secondary: '#2D7AA3',
    },
    mode: 'light', // Optional: Set to 'dark' for dark mode
  },
  typography: {
    fontFamily: `"Cormorant Garamond", "Roboto", "Arial", sans-serif`,
    h6: {
      fontWeight: "bold",
    },
    h5: {
      fontFamily: "Chango",
    },
    h2: {
      fontFamily: "Cormorant Garamond",
    },
    h1: {
      fontFamily: "Bitcount Prop Double Ink",
    }
  },
});

export { SERVER, NEXT_SERVER, CK_EDITOR_LICENSE_KEY, CUSTOM_THEME, VAPID_PUBLIC_KEY };