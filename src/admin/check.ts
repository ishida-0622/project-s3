import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { userConverter } from "../types/firestoreTypes";
import getLoginUser from "../modules/getLoginUser";

// ログイン中のユーザーがadmin権限を持っているかをチェックする
(async () => {
    // ログイン中のユーザーを取得
    const user = await getLoginUser();

    // ログイン中でなかったらTOPに飛ばす
    if (!user) {
        location.href = "/";
        return;
    }

    // DBからユーザー情報を取得
    getDoc(doc(db, `users/${user.uid}`).withConverter(userConverter)).then(
        (d) => {
            // moll_adminでなかったらTOPに飛ばす
            if (d.data()?.type !== "moll_admin") {
                location.href = "/";
            }
        }
    );
})();
