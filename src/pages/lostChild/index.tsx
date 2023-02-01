import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { lostChild } from "../../types/firestoreTypes";
import useLostChild from "../../hooks/useLostChild";
import Modal from "react-modal";
import getNowDate from "../../modules/getNowDate";

Modal.setAppElement("#app");

const LostChild = () => {
    const { lostChild, getLostChild, isLoading, error } = useLostChild();
    if (isLoading) getLostChild();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    return (
        <div
            style={{
                textAlign: "center",
            }}
        >
            <div style={{ textAlign: "left" }}>
                <button
                    onClick={() => history.back()}
                    style={{
                        fontSize: "1rem",
                        padding: ".5rem 1rem",
                        border: "1px solid #ccc",
                        backgroundColor: "#dbffdb",
                        borderRadius: ".5rem",
                        width: "5.5rem",
                        marginTop: "1%",
                    }}
                >
                    戻る
                </button>
            </div>
            <h1>迷子情報</h1>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : lostChild.length === 0 ? (
                <h2>現在迷子情報はありません</h2>
            ) : (
                <>
                    {lostChild.map((child) => {
                        return (
                            <div
                                key={child.id}
                                style={{
                                    border: "solid 1px",
                                    width: "80%",
                                    margin: "1% 10%",
                                }}
                            >
                                <h2>{child.title}</h2>
                                <span>{child.text}</span>
                                <br />
                                <span>{child.date}</span>
                                &emsp;
                                <button
                                    onClick={() => {
                                        if (
                                            !confirm(
                                                "引き渡しが完了しましたか？"
                                            )
                                        )
                                            return;
                                        const d: Pick<lostChild, "is_resolve"> =
                                            { is_resolve: true };
                                        updateDoc(
                                            doc(db, `lost_child/${child.id}`),
                                            d
                                        ).then(() => {
                                            getLostChild();
                                        });
                                    }}
                                >
                                    引き渡し完了
                                </button>
                            </div>
                        );
                    })}
                </>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data: lostChild = {
                            date: getNowDate(),
                            title: title,
                            text: text,
                            is_resolve: false,
                        };
                        addDoc(collection(db, "lost_child"), data).then(() => {
                            setIsModalOpen(false);
                            setTitle("");
                            setText("");
                            getLostChild();
                        });
                    }}
                >
                    <p>タイトル</p>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required={true}
                    />
                    <p>詳細</p>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                            width: "100%",
                            height: "10rem",
                        }}
                        required={true}
                    />
                    <br />
                    <input type="submit" value="追加" />
                </form>
            </Modal>
            <button onClick={() => setIsModalOpen(true)}>迷子情報を追加</button>
        </div>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<LostChild />);
