import { AxiosError } from "axios";
import api from "./axios";
import toaster from "./toaster";

export default async function getPoll(id:string,logout: ()=>void,username: string){
    try {
        const pollData = (await api.post(`/polls/${id}`,{
            username
        })).data;
        console.log(pollData);
        return pollData;
    } catch (error:unknown) {
        console.log(error);
        if(error instanceof AxiosError){
            const errorText = error?.response?.data;
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