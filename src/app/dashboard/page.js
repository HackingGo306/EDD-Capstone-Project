"use client";

import styles from "./page.module.css";
import AccountCard from "@/components/account card/accountCard";

export default function Settings() {

  return (
      <div className={styles.page}>
        <div className={styles.Dashboard}>
          <AccountCard />
        </div>
      </div>
  );
}