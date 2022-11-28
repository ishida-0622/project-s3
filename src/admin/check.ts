import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { userConverter } from "../types/firestoreTypes";
import getLoginUser from "../modules/getLoginUser";

(async () => {
    const user = await getLoginUser();
    if (!user) {
        location.href = "/";
        return;
    }
    getDoc(doc(db, `users/${user.uid}`).withConverter(userConverter)).then(
        (d) => {
            if (d.data()?.type !== "moll_admin") {
                location.href = "/";
            }
        }
    );
})();
