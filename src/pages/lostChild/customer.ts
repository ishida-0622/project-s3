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
    // const elem = document.createElement("div");

    if (element) {
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
            const e = document.createElement("div");
            e.className = "post"
            const elem = document.createElement("h3");
            elem.className = "post-title"
            e.appendChild(elem);
            elem.innerText = data.title;
            const elem2 = document.createElement("p");
            elem2.className = "post-date"
            e.appendChild(elem2);
            elem2.innerText = data.date;
            const elem3 = document.createElement("p");
            elem3.className = "post-text"
            e.appendChild(elem3);
            elem3.innerText = data.text;
            element.appendChild(e)
        });
        // (element as HTMLHeadingElement).textContent
    }
};

main();
