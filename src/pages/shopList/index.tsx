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
            ).docs
                .map((v) => v.data())
                .sort((a, b) => (a.store_name > b.store_name ? 1 : -1))
                .sort((a, b) => a.floor - b.floor);
            setAllShopList(docs);
            setShowShopList(docs);
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
                    const reg = new RegExp(e.target.value);
                    setShowShopList(
                        allShopList.filter(
                            (v) =>
                                v.store_name.match(reg) ||
                                v.tag.some((t) => t.match(reg))
                        )
                    );
                }}
                style={{
                    width: "90%",
                    marginTop: "5%",
                }}
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
                        <div
                            onClick={() => {
                                location.href = `/shop/?name=${shop.store_name}`;
                            }}
                        >
                            <div
                                style={{
                                    width: "20%",
                                    position: "absolute",
                                    marginLeft: "1em",
                                }}
                            >
                                <img
                                    width={"100%"}
                                    src={shop.store_logo}
                                    alt="Logo"
                                />
                            </div>
                            <div>
                                <h3 style={{ margin: "0.5em 0 0 0" }}>
                                    {shop.store_name}
                                </h3>
                                {shop.is_sale ? (
                                    <span style={{ color: "#f00" }}>
                                        セール中!
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <p
                            onClick={() => {
                                location.href = `/shop/?name=${shop.store_name}`;
                            }}
                        >
                            {shop.store_detail}
                        </p>
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
    margin: "3%",
    color: "green",
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<ShopList />);
