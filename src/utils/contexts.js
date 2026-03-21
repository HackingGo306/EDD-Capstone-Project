"use client"

import { getUserInfo } from "@/api/UserAPI";
import { getUserActivities } from "@/api/ActivitiesAPI";
import { getPetInfo } from "@/api/PetAPI";
import { createContext, useCallback, useEffect, useState } from "react";

const PetsContext = createContext({
  pets: {},
  setPets: () => { },
});

const UserInfoContext = createContext({
  userInfo: {} ,
  setUserInfo: () => { },
});

const RefreshContext = createContext({ // Add any other states that require re-rendering remotely
  // This context allows one component to refresh another when prop drilling is too complicated
  timerRefresh: false,
  triggerTimerRefresh: () => { },
});

const PetsProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [refresh, refreshPets] = useState(false);

  useEffect(() => {
    async function fetchPets() {
      const res = await getPetInfo();
      setPets(res.data);
    }
    fetchPets();
  }, [refresh]);

  return (
    <PetsContext.Provider
      value={{
        pets,
        setPets,
        refreshPets
      }}
    >
      {children}
    </PetsContext.Provider>
  )
}

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [refresh, refreshUserInfo] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      const res = await getUserInfo();
      const activities = await getUserActivities();
      res.activities = activities.data;
      setUserInfo(res);
    }
    fetchUserInfo();
  }, [refresh]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        setUserInfo,
        refreshUserInfo,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}

const RefreshContextProvider = ({ children }) => {
  const [timerRefresh, setTimerRefresh] = useState(false);

  const triggerTimerRefresh = useCallback(() => {
    setTimerRefresh(!timerRefresh);
  }, [timerRefresh]);

  return (
    <RefreshContext.Provider
      value={{
        timerRefresh,
        triggerTimerRefresh,
      }}
    >
      {children}
    </RefreshContext.Provider>
  )
}

export { PetsContext, PetsProvider, UserInfoProvider, UserInfoContext, RefreshContext, RefreshContextProvider };