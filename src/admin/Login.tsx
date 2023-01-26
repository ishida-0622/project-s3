import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { userConverter } from "../types/firestoreTypes";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createRoot } from "react-dom/client";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password).then((u) => {
            const uid = u.user.uid;
            getDoc(doc(db, `users/${uid}`).withConverter(userConverter)).then(
                (d) => {
                    if (d.data()?.type === "moll_admin") {
                        location.href = "/admin";
                    } else {
                        signOut(auth).then(() => {
                            location.href = "/";
                        });
                    }
                }
            );
        });
    };

    return (
        <div style={{ textAlign: "center" }}>
            <>
                <h2>Login</h2>
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
                <button onClick={() => login(email, password)}>ログイン</button>
            </>
        </div>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<Login />);
