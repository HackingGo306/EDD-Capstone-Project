import AxiosInstance from "@/utils/axiosInstance";
import { requestHandler } from "@/utils/tools";

async function getPetInfo() {
  const res = await requestHandler(AxiosInstance.get(`/pet`, {}));
  if (res.status == 200) {
    return { data: res.data };
  }
  return { data: {} }
}

async function choosePet({ pet }) {
  const res = await requestHandler(AxiosInstance.post(`/pet/choose`, { pet }));
  if (res.status == 200) {
    return { data: res.data };
  }
  return { data: {} }
}

export { getPetInfo, choosePet };
