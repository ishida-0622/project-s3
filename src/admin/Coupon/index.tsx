import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Coupon, couponConverter } from "../../types/firestoreTypes";

const CouponPage = () => {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState("");

    useEffect(() => {
        (async () => {
            const res = (
                await getDoc(
                    doc(db, "coupon/coupon").withConverter(couponConverter)
                )
            ).data();
            if (!res) throw new Error("coupon document is not found");
            setCoupon(res);
            setText(res.text);
            setImage(res.image);
        })();
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h1>クーポン</h1>
            {coupon && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data: Coupon = {
                            text: text,
                            image: image,
                        };
                        setDoc(doc(db, "coupon/coupon"), data).then(() => {
                            alert("更新しました");
                        });
                    }}
                >
                    <div style={{ width: "100%", margin: "0 auto" }}>
                        <div style={{ width: "40%", margin: "0 auto" }}>
                            <img
                                src={image}
                                alt="logo"
                                style={{ width: "100%" }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                value={imageFile}
                                onChange={(e) => {
                                    setImageFile(e.target.value);
                                    if (e.target.files?.length) {
                                        const file = e.target.files[0];
                                        if (file.size > 1024 ** 2) {
                                            alert(
                                                "ファイルのサイズが大きすぎます\n1MB以内にしてください"
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
                            />
                        </div>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ width: "40%" }}
                        />
                        <br />
                        <input type="submit" value="更新" />
                    </div>
                </form>
            )}
            {!coupon && <h2>Now Loading...</h2>}
        </div>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<CouponPage />);
