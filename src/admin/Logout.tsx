import React from "react";
import { createRoot } from "react-dom/client";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Logout = () => {
    return (
        <button
            onClick={() => {
                signOut(auth).then(() => {
                    location.href = "/admin/login";
                });
            }}
            style={{
                fontSize: location.pathname === "/admin/" ? "1.5rem" : "1rem",
                padding:
                    location.pathname === "/admin/"
                        ? "1rem 1.5rem"
                        : ".5rem 1rem",
                border: "1px solid #ccc",
                backgroundColor: "#dbffdb",
                borderRadius: ".5rem",
            }}
        >
            Log out
        </button>
    );
};

const container = document.querySelector("#logout")!;
const root = createRoot(container);
root.render(<Logout />);
