import { CreatePollType } from "@/types/poll";
import api from "./axios";
import toaster from "./toaster";
import { AxiosError } from "axios";

export default async function createPoll(pollData:CreatePollType,logout:()=>void){
    try {
        console.log(pollData);
        const response = (await api.post("/polls/new",pollData)).data;
        console.log(response);
        return true;
    } catch (error:unknown) {
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