import newsDelete from "../../modules/newsDelete";
import React, { useState } from "react";
import { news } from "../../types/firestoreTypes";
import Modal from "react-modal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

Modal.setAppElement("#app");

const News = (
    props: news & {
        id: string;
        afterNewsDelete?: () => void;
        afterNewsUpdate?: () => void;
    }
) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [text, setText] = useState(props.text);

    return (
        <>
            <div style={{ width: "60%", margin: "0 auto" }}>
                <div style={{ width: "100%" }}>
                    <img src={props.image} width={"100%"} alt="" />
                </div>
                <h2>{title}</h2>
                <p>{text}</p>
                <button onClick={() => setIsEditModalOpen(true)}>編集</button>
                <button
                    onClick={() => {
                        if (confirm("削除しますか？")) {
                            newsDelete(props.id)
                                .then(() => {
                                    if (props.afterNewsDelete) {
                                        props.afterNewsDelete();
                                    }
                                })
                                .catch((e) => {
                                    alert("正常に削除できませんでした");
                                });
                        }
                    }}
                >
                    削除
                </button>
            </div>
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data: news = {
                            title: title,
                            text: text,
                            image: props.image,
                            date: props.date,
                        };
                        updateDoc(doc(db, `news/${props.id}`), data)
                            .then(() => {
                                if (props.afterNewsUpdate) {
                                    props.afterNewsUpdate();
                                }
                                setIsEditModalOpen(false);
                            })
                            .catch((e) => {
                                alert("正常に更新できませんでした");
                            });
                    }}
                >
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required={true}
                    />
                    <textarea
                        rows={10}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ width: "100%" }}
                        required={true}
                    ></textarea>
                    <input type="submit" value="更新" />
                </form>
                <button
                    onClick={() => {
                        setTitle(props.title);
                        setText(props.text);
                        setIsEditModalOpen(false);
                    }}
                >
                    キャンセル
                </button>
            </Modal>
        </>
    );
};

export default News;
