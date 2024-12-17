import toast from 'react-hot-toast';

const toaster = (type: string, message: string, promise_obj?: any) => {
    if (type === "success") {
        toast.success(message);
    } else if (type === "error") {
        toast.error(message);
    } else if (type === "custom") {
        toast.custom(message);
    } else if (type === "promise" && promise_obj) {
        toast.promise(
            promise_obj.promise,
            {
                loading: promise_obj?.loading ?? "Loading",
                success: promise_obj?.success ?? "Success",
                error: promise_obj?.error ?? "Error"
            }
        );
    } else {
        toast(message);
    }
};

export default toaster;
