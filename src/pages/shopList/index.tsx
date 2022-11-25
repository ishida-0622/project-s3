import { collection, getDocs } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import { storeInfo, storeInfoConverter } from "../../types/firestoreTypes";
import { db } from "../../firebase/firebaseConfig";
import { createRoot } from "react-dom/client";

const ShopList = () => {
    const [inputted, setInputted] = useState("");
    const [allShopList, setAllShopList] = useState<storeInfo[]>([]);
    const [showShopList, setShowShopList] = useState<storeInfo[]>([]);

    useLayoutEffect(() => {
        (async () => {
            const docs = (
                await getDocs(
                    collection(db, "store_info").withConverter(
                        storeInfoConverter
                    )
                )
            ).docs;
            setAllShopList(docs.map((v) => v.data()));
            setShowShopList(docs.map((v) => v.data()));
        })();
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <input
                type="text"
                value={inputted}
                placeholder={"店舗を検索"}
                onChange={(e) => {
                    setInputted(e.target.value);
                    setShowShopList(
                        allShopList.filter((v) =>
                            v.store_name.match(
                                new RegExp(`^${e.target.value}.*$`)
                            )
                        )
                    );
                }}
                style={{ width: "90%" }}
            />
            {showShopList.map((shop) =>
                shop.is_hidden ? (
                    <></>
                ) : (
                    <div
                        key={shop.store_name}
                        style={{
                            border: "solid 1px",
                            width: "90%",
                            margin: "2% auto",
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "20%" }}>
                                <img
                                    width={"100%"}
                                    src={shop.store_logo}
                                    alt="Logo"
                                />
                            </div>
                            <h3>{shop.store_name}</h3>
                        </div>
                        <p>{shop.store_detail}</p>
                        {shop.is_camera ? (
                            <button
                                onClick={() => {
                                    location.href = `/congestion?shop_name=${shop.store_name}`;
                                }}
                                style={buttonStyle}
                            >
                                混雑状況確認
                            </button>
                        ) : (
                            <></>
                        )}
                        <button
                            onClick={() => {
                                location.href = `/map?goal=${shop.store_name}&goal_floor=${shop.floor}`;
                            }}
                            style={buttonStyle}
                        >
                            Map
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    height: "2rem",
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<ShopList />);
