import Pagination from "@/types/pagination";
import api from "./axios";
import toaster from "./toaster";
import { AxiosError } from "axios";

export async function getUserPolls(pagination:Pagination,username:string,logout:()=>void){
    try {
        const userPolls = (await api.get(`/polls/user/${username}?per_page=${pagination.per_page}&page=${pagination.page}`)).data;
        console.log(userPolls);
        return userPolls;
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
        return null;
    }
}