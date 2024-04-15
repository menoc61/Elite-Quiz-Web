import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import { isLogin } from "../utils";

const PublicRoute = ({afterLoginAccess = true}) => {
    return (
        isLogin() && !afterLoginAccess ? (
            <Navigate to={"/"}/>
        ) : (
            <Outlet/>
        )
    );
};

export default PublicRoute;