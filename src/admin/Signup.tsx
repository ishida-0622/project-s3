import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { adminConverter, user } from "../types/firestoreTypes";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { createRoot } from "react-dom/client";

const SignUp = () => {
    const [adminPassword, setAdminPassword] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const adminPasswordCheck = (password: string) => {
        getDoc(doc(db, "admin/admin").withConverter(adminConverter)).then(
            (d) => {
                const documentData = d.data();
                if (!documentData) {
                    throw new Error("admin document is not found");
                }
                if (documentData.password === password) {
                    setIsVerified(true);
                }
            }
        );
    };

    const signup = (email: string, password: string, rePassword: string) => {
        if (password !== rePassword) {
            alert("パスワードが一致していません");
            return;
        }
        if (password.length < 6) {
            alert("パスワードが短すぎます");
            return;
        }
        if (password.length > 20) {
            alert("パスワードが長すぎます");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password).then((u) => {
            const uid = u.user.uid;
            const data: user = {
                type: "moll_admin",
            };
            setDoc(doc(db, `users/${uid}`), data);
            sendEmailVerification(u.user).then(() => {
                alert(
                    `${email}に送信されたメールのURLをクリックして認証を完了してください`
                );
            });
        });
    };

    return (
        <div style={{ textAlign: "center" }}>
            {!isVerified ? (
                <>
                    <h2>パスワードを入力してください</h2>
                    <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => {
                            setAdminPassword(e.target.value);
                        }}
                    />
                    <button onClick={() => adminPasswordCheck(adminPassword)}>
                        決定
                    </button>
                </>
            ) : (
                <>
                    <h2>Sign Up</h2>
                    <p>
                        <label>
                            <p
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                メールアドレス
                            </p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />
                        </label>
                    </p>
                    <p
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <label>
                            <p>パスワード</p>
                            <input
                                type="password"
                                value={password}
                                minLength={6}
                                maxLength={20}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                            />
                        </label>
                    </p>
                    <p
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <label>
                            <p>パスワード(再入力)</p>
                            <input
                                type="password"
                                value={rePassword}
                                minLength={6}
                                maxLength={20}
                                onChange={(e) => setRePassword(e.target.value)}
                                required={true}
                            />
                        </label>
                    </p>
                    <button onClick={() => signup(email, password, rePassword)}>
                        アカウント作成
                    </button>
                </>
            )}
        </div>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<SignUp />);
