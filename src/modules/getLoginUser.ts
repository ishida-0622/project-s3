import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const getLoginUser = (): Promise<User | null> => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
};

export default getLoginUser;
