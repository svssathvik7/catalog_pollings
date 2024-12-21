import Pagination from "@/types/pagination";
import api from "@/utils/axios";

export async function getROLivePolls(pagination:Pagination){
    try {
        const liveReadOnlyPolls = (await api.get(`/api/live?per_page=${pagination.per_page}&page=${pagination.page}`)).data;
        console.log(liveReadOnlyPolls);
        return liveReadOnlyPolls;
    } catch (error:any) {
        const errorText = error.response.data;
        console.log(errorText);
        return null;
    }
}
export async function getROClosedPolls(pagination:Pagination){
    try {
        const closedReadOnlyPolls = (await api.get(`/api/closed?per_page=${pagination.per_page}&page=${pagination.page}`)).data;
        return closedReadOnlyPolls;
    } catch (error:any) {
        const errorText = error.response.data;
        console.log(errorText);
        return null;
    }
}