import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { storeInfo, storeInfoConverter } from "../../types/firestoreTypes";

const shopName = new URL(location.href).searchParams.get("name");
if (!shopName) {
    history.back();
}

const Shop = () => {
    const [shopData, setShopData] = useState<storeInfo>({} as storeInfo);
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        (async () => {
            const q = query(
                collection(db, "store_info"),
                where("store_name", "==", shopName)
            ).withConverter(storeInfoConverter);
            const d = (await getDocs(q)).docs.map((v) => v.data())[0] as
                | storeInfo
                | undefined;
            if (!d) {
                history.back();
                return;
            }
            setShopData(d);
            setIsLoading(false);
        })();
    }, []);

    return (
        <>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : (
                <div>
                    <div
                        style={{
                            display: "flex",
                            // margin: "0 auto 0 calc((100% - width) / 2)",
                        }}
                    >
                        <img
                            src={shopData.store_logo}
                            alt="logo"
                            style={{ width: "30%" }}
                        />
                        <h2>
                            {shopData.store_name}({shopData.floor}F)
                        </h2>
                    </div>
                    <p>{shopData.store_detail}</p>
                    {shopData.tag.map((t) => (
                        <span
                            key={t}
                            style={{ border: "solid 1px", margin: "0 2%" }}
                        >
                            &emsp;{t}&emsp;
                        </span>
                    ))}
                    <br />
                    <br />
                    <button
                        onClick={() => history.back()}
                        style={{ height: "2rem", margin: "3%" }}
                    >
                        戻る
                    </button>
                    {shopData.is_camera ? (
                        <button
                            onClick={() => {
                                location.href = `/congestion?shop_name=${shopData.store_name}`;
                            }}
                            style={{ height: "2rem", margin: "3%" }}
                        >
                            混雑状況確認
                        </button>
                    ) : (
                        <></>
                    )}
                    <button
                        onClick={() => {
                            location.href = `/map?goal=${shopData.store_name}&goal_floor=${shopData.floor}`;
                        }}
                        style={{ height: "2rem", margin: "3%" }}
                    >
                        Map
                    </button>
                </div>
            )}
        </>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<Shop />);
