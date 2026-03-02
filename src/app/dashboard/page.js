"use client";

import styles from "./page.module.css";
import AccountCard from "@/components/account card/accountCard";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { CUSTOM_THEME } from "@/utils/config";
import Popup from "@/components/popup/popup";

export default function Settings() {

  return (
    <ThemeProvider theme={CUSTOM_THEME}>
      <div className={styles.page}>
        <div className={styles.Dashboard}>
          <AccountCard />
          <br /><br />
          {/* <Button variant="contained">Hello world</Button> */}
          {/* <Popup /> */}
        </div>
      </div>
    </ThemeProvider>
  );
}