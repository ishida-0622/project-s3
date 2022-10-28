import {
    sendEmailVerification,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

/**
 * サインアップした後、認証メールを送信する
 * @param mail メールアドレス
 * @param pass パスワード
 * @returns メール送信まで正常に終了したらresolveされるPromise
 */
const signup = (mail: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, mail, pass)
            .then((u) => {
                const user = u.user;
                sendEmailVerification(user)
                    .then(() => {
                        signOut(auth);
                        resolve();
                    })
                    .catch((e) => {
                        reject(`メール送信に失敗しました\n${e.code}`);
                    });
            })
            .catch((e) => {
                reject(`アカウント作成に失敗しました\n${e.code}`);
            });
    });
};

/** ログインフォームのHTML要素 */
const element = document.querySelector("#signupForm");

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
            signup(mail, pass)
                .then(() => {
                    location.href = "/";
                })
                .catch((e) => {
                    alert(e);
                });
        }
    });
}
