import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import getNowDate from "../../modules/getNowDate";

const post = (title: string, txt: string) => {
    const postData = {
        date: getNowDate(),
        title: title,
        text: txt,
        is_resolve: false,
    };

    addDoc(collection(db, "lost_child"), postData)
        .then(() => {
            // location.href = "/";
            alert("投稿しました");
        })
        .catch((e) => {
            alert(e.code);
        });
};

const button = document.querySelector("#submit-button") as HTMLButtonElement;
const titleElement = document.querySelector("#title") as HTMLInputElement;
const textElement = document.querySelector("#comment") as HTMLInputElement;

if (button && titleElement && textElement) {
    button.addEventListener("click", () =>
        post(titleElement.value, textElement.value)
    );
}
