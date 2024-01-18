import React from "react";
import { Link } from "react-router-dom";

const First=()=>{
    return(
    <div>
<h1>Hello this is first page</h1>
<Link to={"/second"}>Press here to next page</Link>
</div>
    )
}
export default First;