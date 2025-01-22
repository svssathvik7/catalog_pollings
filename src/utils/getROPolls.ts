import Pagination from "@/types/pagination";
import api from "@/utils/axios";
import { AxiosError } from "axios";
import toaster from "./toaster";

export async function getROLivePolls(pagination:Pagination){
    try {
        const liveReadOnlyPolls = (await api.get(`/p/live?per_page=${pagination.per_page}&page=${pagination.page}`)).data;
        console.log(liveReadOnlyPolls);
        return liveReadOnlyPolls;
    } catch (error:unknown) {
        console.log(error);
        if(error instanceof AxiosError){
            const errorText = error?.response?.data;
            toaster("error",(errorText||"Error fetching live polls"));
        }
        else{
            toaster("error","Something went wrong!");
        }
        return null;
    }
}
export async function getROClosedPolls(pagination:Pagination){
    try {
        const closedReadOnlyPolls = (await api.get(`/p/closed?per_page=${pagination.per_page}&page=${pagination.page}`)).data;
        console.log(closedReadOnlyPolls);
        return closedReadOnlyPolls;
    } catch (error:unknown) {
        console.log(error);
        if(error instanceof AxiosError){
            const errorText = error?.response?.data;
            toaster("error",(errorText || "Error fetching closed polls"));
        }
        else{
            toaster("error","Something went wrong!");
        }
        return null;
    }
}