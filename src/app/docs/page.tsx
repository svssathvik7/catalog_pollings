import { SwaggerDoc } from "@/components/SwaggerComponent";
import "./swagger-ui.css"
const url = "/static/openapi.json";
export default function SwaggerGenerator(){
    return (
        <div className="h-[75dvh] md:h-[85dvh] overflow-y-scroll">
            <SwaggerDoc url={url} docExpansion="none"/>
        </div>
    )
}