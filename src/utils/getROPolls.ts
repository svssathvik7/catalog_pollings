import api from "@/utils/axios";

export default async function getReadOnlyPolls(){
    try {
        const liveReadOnlyPolls = (await api.get("/live")).data;
        const closedReadOnlyPolls = (await api.get("/closed")).data;
        return {liveReadOnlyPolls,closedReadOnlyPolls};
    } catch (error:any) {
        const errorText = error.response.data;
        console.log(errorText);
        return null;
    }
}