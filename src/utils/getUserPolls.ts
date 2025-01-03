import Pagination from "@/types/pagination";
import api from "./axios";

export async function getUserPolls(pagination:Pagination,username:string){
    try {
        const userPolls = (await api.get(`/polls/user/${username}?per_page=${pagination.per_page}&page=${pagination.page}`)).data;
        console.log(userPolls);
        return userPolls;
    } catch (error:any) {
        const errorText = error.response.data;
        console.log(errorText);
        return null;
    }
}