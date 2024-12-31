import api from "./axios";
import toaster from "./toaster";

export default async function getPoll(id:string,logout: ()=>void,username: string){
    try {
        const pollData = (await api.post(`/polls/${id}`,{
            username
        })).data;
        if(pollData.isAuthenticated === false){
            logout();
            toaster("error","login to view poll!");
            return;
        }
        return pollData;
    } catch (error:any) {
        console.log(error);
        const errorText = error.response.data;
        toaster("error",(errorText||"error fetching poll!"));
        return;
    }
}