import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { storeInfo, storeInfoConverter } from "../../types/firestoreTypes";
import FloorMap, { floor } from "./FloorMap";
import sleep from "../../modules/sleep";

const searchBar = document.getElementById(
    "search-bar"
) as HTMLInputElement | null;

if (!searchBar) {
    throw new Error("search bar element is not found");
}

const searchResultArea = document.getElementById(
    "search-result"
) as HTMLDivElement | null;

if (!searchResultArea) {
    throw new Error("search result area is not found");
}
let shopList: storeInfo[] = [];
let showShopList: storeInfo[] = [];

const shopSearch = (inputted: string) => {
    const reg = new RegExp(inputted);
    showShopList = shopList.filter(
        (v) => v.store_name.match(reg) || v.tag.some((t) => t.match(reg))
    );
    searchResultArea.innerHTML = "";
    showShopList.forEach((v) => {
        const e = document.createElement("div");
        const a = document.createElement("a");
        a.href = `./?goal=${v.store_name}&goal_floor=${v.floor}`;
        a.text = v.store_name;
        e.appendChild(a);
        searchResultArea.appendChild(e);
    });
};

searchBar.onfocus = () => {
    searchResultArea.style.display = "";
};

searchBar.onblur = async () => {
    await sleep(100);
    searchResultArea.style.display = "none";
};

(async () => {
    shopList = (
        await getDocs(
            collection(db, "store_info").withConverter(storeInfoConverter)
        )
    ).docs
        .map((v) => v.data())
        .sort((a, b) => (a.store_name > b.store_name ? 1 : -1))
        .sort((a, b) => a.floor - b.floor);
    shopSearch("");
})();

searchBar.oninput = (e) => {
    const { target } = e;
    if (!(target instanceof HTMLInputElement)) {
        throw new Error("search bar element is not input element");
    }
    shopSearch(target.value);
};

const main = async () => {
    const params = new URL(location.href).searchParams;
    const goal = params.get("goal");
    const goalFloor =
        params.get("goal_floor") && isFinite(Number(params.get("goal_floor")))
            ? Number(params.get("goal_floor"))
            : null;
    const floorMap = new FloorMap(4, goal, goalFloor);

    /** 階層選択ボタン */
    const floorSelectButtons = document.querySelectorAll(
        ".floor-select-area"
    ) as NodeListOf<HTMLButtonElement>;

    if (!floorSelectButtons) {
        throw new Error("floor select button is not found");
    }

    floorSelectButtons.forEach((element) => {
        element.addEventListener("click", () => {
            const id = Number(element.id);
            if (isFinite(id)) {
                floorMap.floor = id as floor;
                (
                    document.getElementById("mapImage") as HTMLImageElement
                ).src = `./images/map_${id}.svg`;
            } else {
                throw new Error("floor select button id is not number");
            }
        });
    });
};

main();
