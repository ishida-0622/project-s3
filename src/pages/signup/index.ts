import {
    sendEmailVerification,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

/**
 * サインアップした後、認証メールを送信し、DBにデータを登録する
 * @param mail メールアドレス
 * @param pass パスワード
 * @returns 正常に終了したらresolveされるPromise
 */
const signup = (mail: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, mail, pass)
            .then((u) => {
                const user = u.user;
                sendEmailVerification(user)
                    .then(async () => {
                        await setDoc(doc(db, `users/${user.uid}`), {
                            type: "user",
                        });
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
if (!element) {
    throw new Error("sign up form element is not found");
}

// nullでなかったらsubmitイベントを追加
element.addEventListener("submit", (e) => {
    e.preventDefault();
    const mailElement = document.querySelector(
        "#email"
    ) as HTMLInputElement | null;
    const passElement = document.querySelector(
        "#password"
    ) as HTMLInputElement | null;
    const passCheckElement = document.querySelector(
        "#passwordCheck"
    ) as HTMLInputElement | null;
    if (passElement && passElement.value !== passCheckElement?.value) {
        alert("パスワードが一致しません");
        return;
    }
    if (mailElement && passElement) {
        const mail = mailElement.value;
        const pass = passElement.value;
        signup(mail, pass)
            .then(() => {
                alert(
                    `${mail}に認証メールを送信しました\n添付されているURLをクリックして認証を完了させてください`
                );
                location.href = "/login";
            })
            .catch((e) => {
                alert(e);
            });
    }
});
