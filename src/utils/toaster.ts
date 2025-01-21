import toast from 'react-hot-toast';

const toaster = (type: string, message: string) => {
    if (type === "success") {
        toast.success(message);
    } else if (type === "error") {
        toast.error(message);
    } else if (type === "custom") {
        toast.custom(message);
    }
    else {
        toast(message);
    }
};

export default toaster;
