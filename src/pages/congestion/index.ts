import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

const main = () => {
    const shopName = new URL(location.href).searchParams.get("shop_name");
    const imageElement = document.querySelector("img");
    getDownloadURL(ref(storage, `congestion/${shopName}.png`)).then((url) => {
        if (imageElement) {
            imageElement.src = url;
        }
    });
};

main();
