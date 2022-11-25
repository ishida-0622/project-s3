import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { storeInfo, storeInfoConverter } from "../../types/firestoreTypes";
import { db } from "../../firebase/firebaseConfig";

const main = async () => {
    let shopList: { key: string; value: storeInfo }[] = [];
    const docs = (
        await getDocs(
            collection(db, "store_info").withConverter(storeInfoConverter)
        )
    ).docs;
    shopList = docs.map((v) => {
        return { key: v.id, value: v.data() };
    });
    const element = document.getElementById("shop-list");
    if (element) {
        shopList.forEach((v) => {
            const e = document.createElement("div");
            e.id = v.key;
            e.style.width = "80%";
            e.style.display = "flex";
            e.style.margin = "0 10%";
            const img = document.createElement("img");
            img.src = v.value.store_logo;
            img.style.width = "100%";
            img.alt = "logo";
            const imgInput = document.createElement("input");
            imgInput.type = "file";
            imgInput.accept = "image/*";
            imgInput.onchange = () => {
                const file = imgInput.files![0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    const url = e.target?.result;
                    if (url) {
                        img.src = url as string;
                    }
                };
                reader.readAsDataURL(file);
            };
            const imgWrapper = document.createElement("div");
            imgWrapper.style.width = "30%";
            imgWrapper.style.marginLeft = "0";
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(imgInput);
            const inputWrapper = document.createElement("div");
            inputWrapper.style.margin = "0 0 0 auto";
            inputWrapper.style.width = "70%";
            const shopName = document.createElement("input");
            shopName.type = "text";
            shopName.value = v.value.store_name;
            const shopDetail = document.createElement("textarea");
            shopDetail.value = v.value.store_detail;
            shopDetail.style.width = "100%";
            shopDetail.style.height = "50%";
            const check = document.createElement("input");
            const isHidden = document.createElement("label");
            isHidden.textContent = "Mapに非表示";
            check.type = "checkbox";
            check.checked = v.value.is_hidden;
            isHidden.appendChild(check);
            inputWrapper.appendChild(shopName);
            inputWrapper.appendChild(shopDetail);
            inputWrapper.appendChild(isHidden);
            e.appendChild(imgWrapper);
            e.appendChild(inputWrapper);
            element.appendChild(e);
        });
    }

    const button = document.getElementById(
        "submit"
    ) as HTMLButtonElement | null;
    if (button) {
        button.onclick = () => {
            shopList.forEach((v) => {
                const element = document.getElementById(
                    v.key
                ) as HTMLDivElement;
                const image = (
                    element.childNodes[0].childNodes[0] as HTMLImageElement
                ).src;
                const shopName = (
                    element.childNodes[1].childNodes[0] as HTMLInputElement
                ).value;
                const shopDetail = (
                    element.childNodes[1].childNodes[1] as HTMLTextAreaElement
                ).value;
                const isHidden = (
                    element.childNodes[1].childNodes[2]
                        .childNodes[1] as HTMLInputElement
                ).checked;
                if (image && shopName && shopDetail && isHidden !== undefined) {
                    const updateData: Pick<
                        storeInfo,
                        | "store_name"
                        | "store_logo"
                        | "store_detail"
                        | "is_hidden"
                    > = {
                        store_name: shopName,
                        store_logo: image,
                        store_detail: shopDetail,
                        is_hidden: isHidden,
                    };
                    updateDoc(doc(db, `store_info/${v.key}`), updateData)
                        .then(() => {
                            location.href = "/admin/";
                        })
                        .catch((e) => {
                            alert(`更新に失敗しました\n${e.code}`);
                        });
                }
            });
        };
    }
};

main();
