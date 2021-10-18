import { notification } from "antd";

export const setUserToken = (token: string) => {
  localStorage.setItem("X-JWT", token);
};

export const getUserToken = () => {
  return localStorage.getItem("X-JWT");
};

export const deleteUserToken = () => {
  localStorage.removeItem("X-JWT");
};

type notificationType = "success" | "info" | "warning" | "error";
export const showNotification = ({
  message,
  description = "",
  type = "info",
}: {
  message: string;
  description?: string;
  type: notificationType;
}) => {
  const openNotificationWithIcon = (notiType: notificationType) => {
    notification[notiType]({
      message,
      description,
    });
  };

  openNotificationWithIcon(type);
};

export default showNotification;

export const numb = (x: any) => {
  const rev = x || "";
  return rev.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
