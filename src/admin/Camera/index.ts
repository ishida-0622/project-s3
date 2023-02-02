import { db, storage } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { storeInfoConverter } from "../../types/firestoreTypes";
import { ref, uploadString } from "firebase/storage";

const video = document.querySelector("video");
if (!video) throw new Error("video element is not found");

const audio = document.querySelector("audio");
if (!audio) throw new Error("audio element is not found");

const canvas = document.querySelector("canvas");
if (!canvas) throw new Error("canvas element is not found");

const context = canvas.getContext("2d");
if (!context) throw new Error("context is null");

const selectBox = document.querySelector("select");
if (!selectBox) throw new Error("select box element is not found");

const form = document.querySelector("form");
if (!form) throw new Error("form element is not found");

const intervalInput = document.querySelector(
    "input"
) as HTMLInputElement | null;
if (!intervalInput) throw new Error("input element is not found");

const WIDTH = 600;
const HEIGHT = WIDTH / (4 / 3);

const constraints = {
    audio: false,
    video: true,
};

video.width = WIDTH;
video.height = HEIGHT;

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.play();
});

getDocs(
    query(
        collection(db, "store_info").withConverter(storeInfoConverter),
        where("is_camera", "==", true)
    )
).then((res) => {
    res.docs.forEach((d) => {
        const doc = d.data();
        const op = document.createElement("option");
        op.value = doc.store_name;
        op.text = doc.store_name;
        selectBox.appendChild(op);
    });
});

const upload = (selected: string) => {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context.drawImage(video, 0, 0, WIDTH, HEIGHT);
    const data = canvas.toDataURL("image/png");
    audio.play();
    video.pause();
    setTimeout(() => video.play(), 500);

    const r = ref(storage, `congestion/${selected}.png`);
    uploadString(r, data, "data_url").catch((e) => {
        console.error(e);
    });
};

let interval: NodeJS.Timer | null = null;

form.onsubmit = (e) => {
    e.preventDefault();
    upload(selectBox.value);
    const intervalMm = Number(intervalInput.value);
    if (!isFinite(intervalMm)) {
        throw new Error("inputted number is not a number");
    }
    if (intervalMm < 1) {
        alert("撮影間隔は1分以上に設定してください");
        return;
    }
    if (interval) clearInterval(interval);
    interval = setInterval(
        () => upload(selectBox.value),
        1000 * 60 * intervalMm
    );
    const clearButton = document.createElement("button");
    clearButton.textContent = "停止";
    clearButton.onclick = () => {
        clearInterval(interval!);
        clearButton.remove();
    };
    const el = document.querySelector("#clear");
    if (!el) return;
    el.innerHTML = "";
    el.appendChild(clearButton);
};
