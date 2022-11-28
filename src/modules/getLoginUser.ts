import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";

const getLoginUser = (): Promise<User | null> => {
    const auth = getAuth(app);
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
};

export default getLoginUser;
