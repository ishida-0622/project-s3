import useLoginUser from "../../hooks/useLoginUser";
import React from "react";
import { createRoot } from "react-dom/client";
import Logout from "./Logout";
import Signup from "./Signup";
import Login from "./Login";

const SideMenu = () => {
    const { user, isLoading } = useLoginUser();

    return isLoading ? (
        <></>
    ) : (
        <ul>
            {user ? (
                <Logout />
            ) : (
                <>
                    <Login />
                    <Signup />
                </>
            )}
        </ul>
    );
};

const container = document.querySelector("#h-menu_content")!;
const root = createRoot(container);
root.render(<SideMenu />);
