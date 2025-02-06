import toast from "react-hot-toast";

const formatMessage = (message: string) => {
  const returnMessage = message.slice(0, 20);
  return returnMessage;
};
const toaster = (type: string, message: string) => {
  if (type === "success") {
    toast.success(formatMessage(message));
  } else if (type === "error") {
    toast.error(formatMessage(message));
  } else if (type === "custom") {
    toast.custom(formatMessage(message));
  } else {
    toast(formatMessage(message));
  }
};

export default toaster;
