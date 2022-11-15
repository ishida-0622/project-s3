import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDocs } from "firebase/firestore";
import { lostChildConverter } from "../../types/firestoreTypes";

// const docRef = doc(db, "date", "title", "text");
// // 非同期処理終了awaitを使わない非同期処理
// getDoc(docRef).then((res) => {
//     res.exists();
// });

const main = async () => {
    const element = document.getElementById("element");
    const element2 = document.getElementById("element");
    const element3 = document.getElementById("element");
    // const elem = document.createElement("div");

    if (element&&element2&&element3) {
        const snapshot = await getDocs(
            collection(db, "lost_child").withConverter(lostChildConverter)
        );
        const docs = snapshot.docs;
        docs.forEach((snapshot) => {
            const data = snapshot.data();
            const id = snapshot.id;
            if (data.is_resolve) {
                return;
            }
            // const elem = document.createElement("ul");
            const elem = document.createElement("h4");
            element.appendChild(elem);
            elem.innerText = data.date;
            const elem2 = document.createElement("h4");
            element2.appendChild(elem2);
            elem2.innerText = data.title;
            const elem3 = document.createElement("h4");
            element3.appendChild(elem3);
            elem3.innerText = data.text;

        });
        // (element as HTMLHeadingElement).textContent
    }
};

main();
