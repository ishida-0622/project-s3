import { db } from "../firebase/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

/**
 * TOP画面に表示されるお知らせを削除する関数
 * @param id 削除するお知らせのid
 * @returns 削除処理完了時に解決されるPromise
 */
const newsDelete = (id: string) => {
    return deleteDoc(doc(db, `news/${id}`));
};

export default newsDelete;
