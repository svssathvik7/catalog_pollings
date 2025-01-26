import { SwaggerDoc } from "@/components/SwaggerComponent";
import "./swagger-ui.css"
const url = "/static/openapi.json";
export default function SwaggerGenerator(){
    return (
        <div className="h-[85dvh] md:h-screen overflow-y-scroll w-full">
            <SwaggerDoc url={url} docExpansion="none"/>
        </div>
    )
}