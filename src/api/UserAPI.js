import AxiosInstance from "@/utils/axiosInstance";
import { requestHandler } from "@/utils/tools";

async function getUserInfo() {
  const res = await requestHandler(AxiosInstance.get(`/user`, {}));
  if (res.status == 200) {
    return { loggedIn: true, data: res.data };
  }
  return { loggedIn: false, data: {} }
}

export { getUserInfo };