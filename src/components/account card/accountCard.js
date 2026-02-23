"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getAuthLogout, postAuthSignin, postAuthSignup } from "@/api/AuthAPI";
import { getUserInfo } from "@/api/UserAPI";
import styles from "./accountCard.module.css";

export default function AccountCard() {

  const [userInfo, setUserInfo] = useState(null);
  const [action, setAction] = useState("login");

  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const emailRef = useRef(null);

  const fetchUserInfo = useCallback(async () => {
    const userInfo = await getUserInfo();
    setUserInfo(userInfo.data);
    if (userInfo.loggedIn) {
      setAction("logged in");
    } else {
      setAction("login");
    }
  }, [getUserInfo, setUserInfo, setAction]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.value = "";
      passwordRef.current.value = "";
      passwordConfirmRef.current.value = "";
      emailRef.current.value = "";
    }
    if (loginEmailRef.current) {
      loginEmailRef.current.value = "";
      loginPasswordRef.current.value = "";
    }
  }, [action]);

  const handleLogin = useCallback(async () => {
    const email = loginEmailRef.current?.value;
    const password = loginPasswordRef.current?.value;

    console.log("Attempting login with:", { email, password });

    if (!email || !password) {
      console.log("Email or password is missing");
      return;
    }

    await postAuthSignin({ email, password });
    fetchUserInfo();
  }, [loginEmailRef, loginPasswordRef, fetchUserInfo]);

  const handleRegister = useCallback(() => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (!username || !password || !passwordConfirm) {
      console.log("Username, password, or password confirmation is missing");
      return;
    }
    if (password !== passwordConfirm) {
      console.log("Password and confirmation do not match");
      return;
    }

    postAuthSignup({ email, name: username, password });
    setAction("login");
  }, [usernameRef, emailRef, passwordRef, passwordConfirmRef, fetchUserInfo]);

  const handleLogout = useCallback(() => {
    getAuthLogout();
    setUserInfo(null);
    setAction("login");
  }, [getAuthLogout, setUserInfo, setAction]);

  return (
    <div className={styles.AccountCard}>
      <h1>Account Card</h1>
      {action != "logged in" && <div>{
        action === "login" ?
          <div>
            <input type="text" placeholder="Email" ref={loginEmailRef} />
            <input type="password" placeholder="Password" ref={loginPasswordRef} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => setAction("register")}>Sign up</button>
          </div>
          :
          <div>
            <input type="text" placeholder="Username" ref={usernameRef} />
            <input type="text" placeholder="Email" ref={emailRef} />
            <input type="password" placeholder="Password" ref={passwordRef} />
            <input type="password" placeholder="Confirm Password" ref={passwordConfirmRef} />
            <button onClick={handleRegister}>Register</button>
            <button onClick={() => setAction("login")}>I have an account</button>
          </div>
      }</div>}
      {action === "logged in" && <div>
        <h2>Welcome, {userInfo?.name || "User"}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>}
    </div>
  );
}