import { AxiosError } from "axios";
import api from "./axios";
import toaster from "./toaster";

export default async function getPoll(id:string,logout: ()=>void,username: string){
    try {
        const pollData = (await api.post(`/polls/${id}`,{
            username
        })).data;
        return pollData.result;
    } catch (error:unknown) {
        console.log(error);
        if(error instanceof AxiosError){
            const errorText = error?.response?.data?.error;
            if (error?.response?.data?.isAuthenticated === false) {
                logout();
                toaster("error", "Please login to view poll!");
            }
            else{
                toaster("error",errorText);
            }
        }
        else{
            toaster("error","Something went wrong!");
        }
        return false;
    }
}