import {
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import getLoginUser from "modules/getLoginUser";
import { userConverter } from "types/firestoreTypes";
import { auth, db } from "../../firebase/firebaseConfig";

/**
 * ログイン
 * 認証済みでないならメールを送信する
 * @param mail メールアドレス
 * @param pass パスワード
 * @returns ログインに成功し、認証済みならtrue、そうでないならfalseがresolveされるPromise
 */
const login = (mail: string, pass: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, mail, pass)
            .then((u) => {
                if (u.user.emailVerified) {
                    resolve(true);
                } else {
                    sendEmailVerification(u.user);
                    resolve(false);
                }
            })
            .catch((e) => {
                reject(e.code);
            });
    });
};

/** ログインフォームのHTML要素 */
const element = document.querySelector("#loginForm");

if (element) {
    // nullでなかったらsubmitイベントを追加
    element.addEventListener("submit", (e) => {
        e.preventDefault();
        const mailElement = document.querySelector(
            "#email"
        ) as HTMLInputElement;
        const passElement = document.querySelector(
            "#password"
        ) as HTMLInputElement;
        if (mailElement && passElement) {
            const mail = mailElement.value;
            const pass = passElement.value;
            login(mail, pass)
                .then(async (res) => {
                    if (res) {
                        const user = (await getLoginUser())!;
                        const document = (
                            await getDoc(
                                doc(db, `users/${user.uid}`).withConverter(
                                    userConverter
                                )
                            )
                        ).data()!;
                        if (document.type === "user") {
                            location.href = "/";
                        } else if (document.type === "moll_admin") {
                            location.href = "/admin/";
                        } else {
                            location.href = "/admin/";
                        }
                    } else {
                        signOut(auth);
                        alert(
                            `
                            メールアドレス認証が済んでいません\n
                            ${mail}に送信されたメールのURLをクリックして認証を完了してください
                            `
                        );
                    }
                })
                .catch((e) => {
                    alert(e);
                });
        }
    });
}
