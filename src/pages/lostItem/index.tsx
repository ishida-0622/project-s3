import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { lostItem } from "../../types/firestoreTypes";
import useLostItem from "../../hooks/useLostItem";
import Modal from "react-modal";
import getNowDate from "../../modules/getNowDate";

const LostItem = () => {
    const { lostItems, getLostItems, isLoading, error } = useLostItem();
    if (isLoading) getLostItems();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    return (
        <div
            style={{
                textAlign: "center",
            }}
        >
            <h1>落とし物情報</h1>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : lostItems.length === 0 ? (
                <h2>現在落とし物はありません</h2>
            ) : (
                <>
                    {lostItems.map((item) => {
                        return (
                            <div
                                key={item.id}
                                style={{
                                    border: "solid 1px",
                                    width: "80%",
                                    margin: "1% 10%",
                                }}
                            >
                                <h2>{item.title}</h2>
                                <span>{item.text}</span>
                                <br />
                                <span>{item.date}</span>
                                &emsp;
                                <button
                                    onClick={() => {
                                        if (
                                            !confirm(
                                                "引き渡しが完了しましたか？"
                                            )
                                        )
                                            return;
                                        const d: Pick<lostItem, "is_resolve"> =
                                            { is_resolve: true };
                                        updateDoc(
                                            doc(db, `lost_item/${item.id}`),
                                            d
                                        ).then(() => {
                                            getLostItems();
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
                        const data: lostItem = {
                            date: getNowDate(),
                            title: title,
                            text: text,
                            is_resolve: false,
                        };
                        addDoc(collection(db, "lost_item"), data).then(() => {
                            setIsModalOpen(false);
                            setTitle("");
                            setText("");
                            getLostItems();
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
            <button onClick={() => setIsModalOpen(true)}>落とし物を追加</button>
        </div>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<LostItem />);
