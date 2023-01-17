import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

/**
 * ログイン中のユーザーを取得する
 * @returns ログイン中であればユーザーの情報、ログイン中でなければnullがresolveされるPromise
 */
const getLoginUser = (): Promise<User | null> => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
};

export default getLoginUser;
