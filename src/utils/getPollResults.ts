import api from "./axios";
import toaster from "./toaster";

export default async function getPollResults(id:string,logout: ()=>void,username: string){
    try {
        const pollResult = (await api.get(`/polls/${id}/results`)).data;
        console.log(pollResult);
        return pollResult;
    } catch (error:any) {
        console.log(error);
        if(error?.response?.data?.isAuthenticated === false){
            logout();
            toaster("error","Session expired! Please login to view poll result!");
            return "noauth";
        }
        return false;
    }
}