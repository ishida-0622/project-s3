import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import getNowDate from "../../modules/getNowDate";
import React, { useState } from "react";
import Modal from "react-modal";
import { news } from "../../types/firestoreTypes";

Modal.setAppElement("#app");

const AddNewsModal = (props: {
    buttonValue: string;
    successFunc?: () => void;
    failFunc?: (e: unknown) => void;
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState("");

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>
                {props.buttonValue}
            </button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data: news = {
                            title: title,
                            text: text,
                            image: image,
                            date: getNowDate(),
                        };
                        addDoc(collection(db, "news"), data)
                            .then(() => {
                                if (props.successFunc) props.successFunc();
                                setIsModalOpen(false);
                                setTitle("");
                                setText("");
                                setImage("");
                            })
                            .catch((e) => {
                                if (props.failFunc) props.failFunc(e);
                            });
                    }}
                >
                    <div style={{ width: "100%" }}>
                        <img src={image} width={"100%"} alt="" />
                        <input
                            type="file"
                            name=""
                            accept="image/*"
                            value={imageFile}
                            onChange={(e) => {
                                setImageFile(e.target.value);
                                if (e.target.files?.length) {
                                    const file = e.target.files[0];
                                    if (file.size > 1024 ** 2) {
                                        alert(
                                            "?????????????????????????????????????????????\n1MB???????????????????????????"
                                        );
                                        setImageFile("");
                                        setImage("");
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const url = e.target?.result;
                                        if (url) {
                                            setImage(url as string);
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            required={true}
                        />
                    </div>
                    <label>
                        ????????????
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                            required={true}
                        />
                    </label>
                    <label>
                        ??????
                        <br />
                        <textarea
                            name="text"
                            rows={10}
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                            }}
                            required={true}
                            style={{ width: "100%" }}
                        />
                    </label>
                    <input type="submit" value={"??????"}></input>
                </form>
                <button onClick={() => setIsModalOpen(false)}>
                    ???????????????
                </button>
            </Modal>
        </>
    );
};

export default AddNewsModal;
