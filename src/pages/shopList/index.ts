import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDocs } from "firebase/firestore";
import { storeInfoConverter } from "../../types/firestoreTypes";

const main = async () => {
    const element = document.getElementById("element");
    const element2 = document.getElementById("element");
    const element3 = document.getElementById("element");

    if (element && element2 && element3) {
        const snapshot = await getDocs(
            collection(db, "store_info").withConverter(storeInfoConverter)
        );

        const docs = snapshot.docs;
        docs.forEach((snapshot) => {
            const data = snapshot.data();
            const id = snapshot.id;
            if (data.is_resolve) {
                return;
            }
            const elem = document.createElement("h4");
            element.appendChild(elem);
            elem.innerText = data.store_name;
            const elem2 = document.createElement("h4");
            element2.appendChild(elem2);
            elem2.innerText = data.store_logo;
            const elem3 = document.createElement("h4");
            element3.appendChild(elem3);
            elem3.innerText = data.store_detail;
        });
    }
};

main();
