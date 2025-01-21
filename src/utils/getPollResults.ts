import { AxiosError } from "axios";
import api from "./axios";
import toaster from "./toaster";

export default async function getPollResults(id:string,logout: ()=>void,username?: string){
    try {
        const pollResult = (await api.get(`/polls/${id}/results`)).data;
        console.log(username);
        console.log(pollResult);
        return pollResult;
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