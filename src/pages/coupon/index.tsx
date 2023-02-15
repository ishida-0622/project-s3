import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Coupon, couponConverter } from "../../types/firestoreTypes";

const CouponPage = () => {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    useEffect(() => {
        (async () => {
            const res = (
                await getDoc(
                    doc(db, "coupon/coupon").withConverter(couponConverter)
                )
            ).data();
            if (!res) throw new Error("coupon document is not found");
            setCoupon(res);
        })();
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>ログイン特典!</h2>
            {coupon && (
                <div style={{ width: "80%", margin: "0 auto" }}>
                    <div>
                        <img
                            src={coupon.image}
                            alt="logo"
                            style={{ width: "100%" }}
                        />
                    </div>
                    <span>{coupon.text}</span>
                </div>
            )}
            {!coupon && <h2>Now Loading...</h2>}
        </div>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<CouponPage />);
