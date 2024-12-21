import { useAuthStore } from "@/store/authStore";
import api from "./axios";
import toaster from "./toaster";

export default async function createPoll(pollData:any,logout:()=>void){
    try {
        const response = (await api.post("/polls/new",pollData)).data;
        if(response.isAuthenticated === false){
            logout();
            toaster("error","login to create poll!");
            return;
        }
        toaster("success","poll created!");
        return true;
    } catch (error:any) {
        const errorText = error.response.data;
        console.log(error);
        toaster("error",(errorText||"error creating poll!"));
        return false;
    }
}