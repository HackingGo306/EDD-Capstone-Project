import AxiosInstance from "@/utils/axiosInstance";
import { requestHandler } from "@/utils/tools";

async function sendWaterNotification() {
  const res = await requestHandler(AxiosInstance.post(`/send-notification`, { title: "Water Reminder", body: "Don't forget to drink water!", icon: "Water.png", url: "http://localhost:8000/dashboard" }));
}

async function sendEyeNotification() {
  const res = await requestHandler(AxiosInstance.post(`/send-notification`, { title: "Eye Reminder", body: "Don't forget to rest your eyes!", icon: "", url: "http://localhost:8000/dashboard" }));
}

async function sendStretchNotification() {
  const res = await requestHandler(AxiosInstance.post(`/send-notification`, { title: "Stretch Reminder", body: "Don't forget to stretch!", icon: "petImage", url: "http://localhost:8000/dashboard" }));
}

export { sendWaterNotification, sendEyeNotification, sendStretchNotification };