import AxiosInstance from "@/utils/axiosInstance";
import { requestHandler } from "@/utils/tools";

async function getUserActivities() {
  const res = await requestHandler(AxiosInstance.get(`/activities`, {}));
  if (res.status == 200) {
    return { data: res.data };
  }
  return { data: {} }
}

async function addUserActivity({type, time}) {
  const res = await requestHandler(AxiosInstance.post(`/activities/add`, {type, time}));
  if (res.status == 200) {
    return { data: res.data };
  }
  return { data: {} }
}

async function beginUserActivity({type}) {
  const res = await requestHandler(AxiosInstance.post(`/activities/begin`, {type}));
  if (res.status == 200) {
    return { data: res.data };
  }
  return { data: {} }
}

async function endUserActivity() {
  const res = await requestHandler(AxiosInstance.post(`/activities/end`, {}));
  if (res.status == 200) {
    return { data: res.data };
  }
  return { data: {} }
}

export { getUserActivities, addUserActivity, beginUserActivity, endUserActivity };