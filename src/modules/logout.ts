import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const element = document.querySelector("#logout") as HTMLAnchorElement | null;

if (element) {
    element.addEventListener("click", () => {
        signOut(auth);
        location.href = "/";
    });
}
