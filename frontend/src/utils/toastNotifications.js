import { toast } from "react-toastify";

export const toastSuccess = (message) => {
  return new Promise((resolve) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: resolve,
    });
  });
};

export const toastError = (message) => {
  return new Promise((resolve) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: resolve,
      className: "auto-width-toast",
    });
  });
};

export const toastWarn = (message) => {
  return new Promise((resolve) => {
    toast.warn(message, {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: resolve,
    });
  });
};
export const toastInfo = (message) => {
  return new Promise((resolve) => {
    toast.info(message, {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: resolve,
    });
  });
};
