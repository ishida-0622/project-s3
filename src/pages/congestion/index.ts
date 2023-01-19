import { getDownloadURL, ref, getMetadata } from "firebase/storage";
import utcToJst from "../../modules/utcToJst";
import { storage } from "../../firebase/firebaseConfig";

const shopName = new URL(location.href).searchParams.get("shop_name");
const imageElement = document.querySelector("img");
const timeStampElement = document.getElementById("timestamp");
const reloadButton = document.getElementById("reload");

if (!shopName) {
    location.href = "/shop-list";
}

if (!reloadButton) {
    throw new Error("reload button is not found");
}

if (!(imageElement && timeStampElement)) {
    throw new Error("element is not found");
}

const reloadImage = () => {
    const r = ref(storage, `congestion/${shopName}.png`);
    getDownloadURL(r).then((url) => {
        if (imageElement) {
            imageElement.src = url;
        }
    });
    getMetadata(r).then((metadata) => {
        const [yyyymmdd, hhmmss] = metadata.timeCreated.split(/[A-Z]/);
        timeStampElement.textContent = utcToJst(yyyymmdd, hhmmss.slice(0, 8));
    });
};

reloadImage();

reloadButton.addEventListener("click", () => {
    reloadImage();
});
