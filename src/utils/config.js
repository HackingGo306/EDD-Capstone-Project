"use client";

const SERVER = process.env.NEXT_PUBLIC_SERVER;
const NEXT_SERVER = process.env.NEXT_PUBLIC_NEXT_SERVER;
const CK_EDITOR_LICENSE_KEY = process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY;

import { createTheme } from '@mui/material/styles';
const CUSTOM_THEME = createTheme({
  palette: {
    primary: {
      main: '#E0B0FF',
    },
    secondary: {
      main: '#84ACC9',
    },
    text: {
      primary: '#344552',
      secondary: '#2D7AA3',
    },
    mode: 'light', // Optional: Set to 'dark' for dark mode
  },
});

export { SERVER, NEXT_SERVER, CK_EDITOR_LICENSE_KEY, CUSTOM_THEME };