import api from "./axios";
import toaster from "./toaster";

export default async function getPoll(id:string,logout: ()=>void,username: string){
    try {
        const pollData = (await api.post(`/polls/${id}`,{
            username
        })).data;
        console.log(pollData);
        return pollData;
    } catch (error:any) {
        console.log(error);
        if(error?.response?.data?.isAuthenticated === false){
            logout();
            toaster("error","Please login to view poll!");
            return "noauth";
        }
        return false;
    }
}