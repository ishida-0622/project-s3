import { db } from "../../firebase/firebaseConfig";
import { collection , doc, getDocs } from "firebase/firestore";
import {storeInfo, storeInfoConverter } from "../../types/firestoreTypes";

let allStoreInfo:storeInfo[] = [];
let showStore:storeInfo[] = [];

const main = async () => {
    const element = document.getElementById("UL");
    const element2 = document.getElementById("UL");

    if (element && element2) {
        const snapshot = await getDocs(
            collection(db, "store_info").withConverter(storeInfoConverter)
        );

        const docs = snapshot.docs;
        allStoreInfo = docs.map(v => v.data());
        console.log(allStoreInfo);
        allStoreInfo.forEach((val) => {
            if (val.is_resolve){
                return;
            }
            const elem = document.createElement("li");
            element.appendChild(elem);
            elem.innerText = val.store_name;
            const elem2 = document.createElement("a");
            element.appendChild(elem2);
            elem2.innerText = val.store_logo;
            const elem3 = document.createElement("li");
            element.appendChild(elem3);
            elem3.innerText = val.store_detail;
        });
    }
};


const searchWord =  document.getElementById("input-word") as HTMLInputElement

searchWord.addEventListener("keyup", (event) => {
    console.log((event.target as any).value)
    showStore = allStoreInfo.filter((val) =>
        val.store_name.match(
            new RegExp("^" + searchWord.value.replace(/\s+/g, ""))
        )
    )

    const element = document.getElementById("UL");
    element!.innerHTML = ""
    showStore.forEach((val) => {
        const e = document.createElement("div");
        const shopNameElement = document.createElement("h3");
        const shopImageElement = document.createElement("img");
        const shopDataElement = document.createElement("p");
        shopNameElement.textContent = val.store_name
        shopImageElement.src = val.store_logo
        shopDataElement.textContent = val.store_detail
        e.appendChild(shopNameElement)
        e.appendChild(shopImageElement)
        e.appendChild(shopDataElement)
        element?.appendChild(e);
    })
})

main();
