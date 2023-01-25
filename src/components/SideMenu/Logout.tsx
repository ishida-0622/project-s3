import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/firebaseConfig";

const Logout = () => {
    return (
        <li>
            <a
                onClick={async () => {
                    signOut(auth).then(() => {
                        location.href = "/";
                    });
                }}
            >
                Log out
            </a>
        </li>
    );
};

export default Logout;
