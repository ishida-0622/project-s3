import {
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

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
                .then((res) => {
                    if (res) {
                        location.href = "/";
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
