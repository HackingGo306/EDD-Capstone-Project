"use client";

import {useState, useRef, useEffect, useCallback} from "react";
import { postAuthSignin } from "@/api/AuthAPI";
import styles from "./accountCard.module.css";

export default function AccountCard() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = useCallback(() => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    console.log("Attempting login with:", { username, password });

    if (!username || !password) {
      console.log("Username or password is missing");
      return;
    }
    postAuthSignin({ email: username, password });

  }, [usernameRef, passwordRef]);

  return (
      <div className={styles.AccountCard}>
        <h1>Account Card</h1>
        <input type="text" placeholder="Username" ref={usernameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button onClick={handleLogin}>Login</button>
      </div>
  );
}