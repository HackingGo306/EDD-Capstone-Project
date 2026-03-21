"use client";

import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { getAuthLogout, postAuthSignin, postAuthSignup } from "@/api/AuthAPI";
import { getUserInfo } from "@/api/UserAPI";
import styles from "./accountCard.module.css";
import { UserInfoContext } from "@/utils/contexts";
import TextField from '@mui/material/TextField';
import { Button, Typography } from "@mui/material";


export default function AccountCard() {

  const {userInfo, refreshUserInfo} = useContext(UserInfoContext);
  const [action, setAction] = useState("login");

  const [loginEmailValue, setLoginEmailValue] = useState("");
  const [loginPasswordValue, setLoginPasswordValue] = useState("");

  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");

  useEffect(() => {
    if (userInfo.loggedIn) {
      setAction("logged in");
    }
    else {
      setAction("login");
    }
  }, [userInfo]);

  useEffect(() => {
    setUsernameValue("");
    setPasswordValue("");
    setPasswordConfirmValue("");
    setEmailValue("");
    setLoginEmailValue("");
    setLoginPasswordValue("");
  }, [action]);

  const handleLogin = useCallback(async () => {
    const email = loginEmailValue;
    const password = loginPasswordValue;

    console.log("Attempting login with:", { email, password });

    if (!email || !password) {
      console.log("Email or password is missing");
      return;
    }

    await postAuthSignin({ email, password });
    setTimeout(refreshUserInfo, 100);
  }, [loginEmailValue, loginPasswordValue]);

  const handleRegister = useCallback(async () => {
    const username = usernameValue;
    const email = emailValue;
    const password = passwordValue;
    const passwordConfirm = passwordConfirmValue;

    if (!username || !password || !passwordConfirm) {
      console.log("Username, password, or password confirmation is missing");
      return;
    }
    if (password !== passwordConfirm) {
      console.log("Password and confirmation do not match");
      return;
    }

    await postAuthSignup({ email, name: username, password });
    setAction("login");
    setTimeout(refreshUserInfo, 100);
  }, [usernameValue, emailValue, passwordValue, passwordConfirmValue]);

  const handleLogout = useCallback(async() => {
    await getAuthLogout();
    setAction("login");
    setTimeout(refreshUserInfo, 100);
  }, [getAuthLogout, setAction]);

  return (
    <div className={styles.AccountCard}>
      {action != "logged in" && <div>{
        action === "login" ?
          <div className={styles.Login}>
            <Typography variant="h5" gutterBottom>Login In To Pet Care</Typography>
            <TextField
              required
              label="Email"
              variant="filled"
              value={loginEmailValue}
              onChange={(e) => setLoginEmailValue(e.target.value)}
            />
            <TextField
              required
              label="Password"
              variant="filled"
              type="password"
              value={loginPasswordValue}
              onChange={(e) => setLoginPasswordValue(e.target.value)}
            />
            <div>
              <Button variant="outlined" onClick={handleLogin}>Login</Button>
              <Typography variant="body2" sx={{ display: "inline", mx: 1 }}>or</Typography>
              <Button variant="outlined" onClick={() => setAction("register")}>Register</Button>
            </div>
          </div>
          :
          <div className={styles.Register}>
            <Typography variant="h5" gutterBottom>Register For Pet Care</Typography>
            <TextField
              required
              label="Username"
              variant="filled"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
            />
            <TextField
              required
              label="Email"
              variant="filled"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <TextField
              required
              label="Password"
              variant="filled"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <TextField
              required
              label="Confirm Password"
              variant="filled"
              type="password"
              value={passwordConfirmValue}
              onChange={(e) => setPasswordConfirmValue(e.target.value)}
            />

            <Button variant="outlined" onClick={handleRegister}>Register</Button>
            <Button variant="outlined" onClick={() => setAction("login")}>I have an account</Button>
          </div>
      }</div>}
      {action === "logged in" && <div>
        <Typography variant="h5" gutterBottom>Welcome, {userInfo?.data?.name || "User"}!</Typography>
        <Typography variant="body1" gutterBottom>You can view your pet information and stats on this dashboard page</Typography>
        <Button variant="contained" size="small" onClick={handleLogout}>Logout</Button>
      </div>}
    </div>
  );
}