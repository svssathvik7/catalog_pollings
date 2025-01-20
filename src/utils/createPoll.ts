import { useAuthStore } from "@/store/authStore";
import api from "./axios";
import toaster from "./toaster";
import { useRouter } from "next/navigation";

export default async function createPoll(pollData:any,logout:()=>void){
    try {
        const response = (await api.post("/polls/new",pollData)).data;
        toaster("success","poll created!");
        return true;
    } catch (error:any) {
        const errorText = error.response.data;
        console.log(error);
        if(error?.response?.data?.isAuthenticated === false){
            logout();
            toaster("error","Session expired! Pleaselogin to view poll!");
            return;
        }
        toaster("error",(errorText||"error creating poll!"));
        return false;
    }
}