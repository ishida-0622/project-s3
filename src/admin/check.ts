import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { userConverter } from "../types/firestoreTypes";
import getUserData from "../modules/getUserData";

(async () => {
    const user = await getUserData();
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
