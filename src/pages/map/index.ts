import FloorMap from "./FloorMap";

const main = async () => {
    const params = new URL(location.href).searchParams;
    const goal = params.get("goal");
    const goalFloor =
        params.get("goal_floor") && isFinite(Number(params.get("goal_floor")))
            ? Number(params.get("goal_floor"))
            : null;
    // TODO:6
    const floorMap = new FloorMap(6, goal, goalFloor);

    /** 階層選択ボタン */
    const floorSelectButtons = document.querySelectorAll(
        ".floor-select-area"
    ) as NodeListOf<HTMLButtonElement>;

    if (!floorSelectButtons) {
        throw Error("floor select button is not found");
    }

    floorSelectButtons.forEach((element) => {
        element.addEventListener("click", () => {
            const id = Number(element.id);
            if (isFinite(id)) {
                floorMap.floor = id;
                (
                    document.getElementById("mapImage") as HTMLImageElement
                ).src = `./images/map_${id}.svg`;
            } else {
                throw Error("floor select button id is not number");
            }
        });
    });
};

main();
