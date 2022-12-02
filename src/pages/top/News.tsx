import React, { useMemo, useState } from "react";
import { news } from "../../types/firestoreTypes";
import Modal from "react-modal";

Modal.setAppElement("#app");

const News = (props: news) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div onClick={() => setIsOpen(true)} style={{ width: "50%" }}>
                <div>
                    <img src={props.image} width={"100%"} alt="image" />
                </div>
                <p>{props.title}</p>
            </div>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                <div>
                    <div>
                        <img src={props.image} width={"100%"} alt="image" />
                    </div>
                    <h2>{props.title}</h2>
                    <p>{props.text}</p>
                    <button onClick={() => setIsOpen(false)}>閉じる</button>
                </div>
            </Modal>
        </>
    );
};

export default News;
