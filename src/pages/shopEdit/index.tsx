import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import { storeInfo, storeInfoConverter } from "../../types/firestoreTypes";
import Modal from "react-modal";
import { createRoot } from "react-dom/client";

Modal.setAppElement("#app");

const ShopElement = (props: storeInfo & { id: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState("");
    const [image, setImage] = useState(props.store_logo);
    const [shopName, setShopName] = useState(props.store_name);
    const [shopDetail, setShopDetail] = useState(props.store_detail);
    const [isHidden, setIsHidden] = useState(props.is_hidden);
    const [isSale, setIsSale] = useState(props.is_sale);
    const [tag, setTag] = useState(props.tag ? props.tag.join(",") : "");
    const [isSpace, setIsSpace] = useState(false);

    return (
        <>
            <div
                style={{
                    width: "80%",
                    display: "flex",
                    margin: "0 10%",
                    border: "solid 1px",
                }}
            >
                <div style={{ width: "30%", marginLeft: "0" }}>
                    <img src={image} alt="logo" style={{ width: "100%" }} />
                </div>
                <div style={{ width: "70%", margin: "0 0 0 auto" }}>
                    <h2>{shopName}</h2>
                    <p>{shopDetail}</p>
                    <button onClick={() => setIsModalOpen(true)}>編集</button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <div style={{ display: "flex", height: "calc(100% - 3rem)" }}>
                    <div style={{ width: "30%", marginLeft: 0 }}>
                        <img src={image} alt="logo" style={{ width: "100%" }} />
                        <input
                            type="file"
                            name="storeLogo"
                            accept="image/*"
                            value={imageFile}
                            style={{ width: "100%" }}
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
                                } else {
                                    setImage(props.store_logo);
                                }
                            }}
                        />
                    </div>
                    <div style={{ width: "70%", margin: "0 0 0 auto" }}>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                        />
                        <textarea
                            value={shopDetail}
                            onChange={(e) => setShopDetail(e.target.value)}
                            style={{ width: "100%", height: "50%" }}
                        ></textarea>
                        <label>
                            <span>タグ:</span>
                            <input
                                type="text"
                                placeholder="カンマ区切りで入力"
                                value={tag}
                                onChange={(e) => {
                                    if (/^\S*$/.test(e.target.value)) {
                                        setIsSpace(false);
                                    } else {
                                        setIsSpace(true);
                                    }
                                    setTag(e.target.value);
                                }}
                                style={{ width: "calc(100% - 3rem)" }}
                            />
                        </label>
                        <span
                            style={{
                                display: isSpace ? "block" : "none",
                                color: "#f00",
                            }}
                        >
                            空白は使えません
                        </span>
                        <label style={{ marginRight: "5%" }}>
                            セール中
                            <input
                                type="checkbox"
                                name="isSale"
                                checked={isSale}
                                onChange={(e) => setIsSale(e.target.checked)}
                            />
                        </label>
                        <label>
                            Mapに非表示
                            <input
                                type="checkbox"
                                name="isHidden"
                                checked={isHidden}
                                onChange={(e) => setIsHidden(e.target.checked)}
                            />
                        </label>
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <button onClick={() => setIsModalOpen(false)}>
                        キャンセル
                    </button>
                    <button
                        onClick={() => {
                            const data: Omit<storeInfo, "floor" | "is_camera"> =
                                {
                                    store_name: shopName,
                                    store_logo: image,
                                    store_detail: shopDetail,
                                    tag: tag.split(","),
                                    is_sale: isSale,
                                    is_hidden: isHidden,
                                };
                            updateDoc(
                                doc(db, `store_info/${props.id}`),
                                data
                            ).then(() => {
                                location.reload();
                            });
                        }}
                    >
                        更新
                    </button>
                </div>
            </Modal>
        </>
    );
};

const ShopEdit = () => {
    const [shopList, setShopList] = useState<(storeInfo & { key: string })[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        (async () => {
            const docs = (
                await getDocs(
                    collection(db, "store_info").withConverter(
                        storeInfoConverter
                    )
                )
            ).docs;
            setShopList(
                docs
                    .map((d) => {
                        return { ...d.data(), key: d.id };
                    })
                    .sort((a, b) => (a.store_name > b.store_name ? 1 : -1))
                    .sort((a, b) => a.floor - b.floor)
            );
            setIsLoading(false);
        })();
    }, []);

    return (
        <>
            {isLoading ? (
                <div style={{ textAlign: "center" }}>
                    <h2>Now Loading...</h2>
                </div>
            ) : (
                <>
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
                    {shopList.map((shop) => (
                        <ShopElement
                            key={shop.key}
                            store_name={shop.store_name}
                            store_logo={shop.store_logo}
                            store_detail={shop.store_detail}
                            tag={shop.tag}
                            floor={shop.floor}
                            is_camera={shop.is_camera}
                            is_sale={shop.is_sale}
                            is_hidden={shop.is_hidden}
                            id={shop.key}
                        />
                    ))}
                </>
            )}
        </>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<ShopEdit />);
