import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { map, mapConverter } from "../../types/firestoreTypes";
import sleep from "../../modules/sleep";
import distance from "../../modules/distance";

export type floor = 4 | 5 | 6;

class FloorMap {
    /** 現在の階層 */
    private _floor: floor = 4;
    private shopList!: map;
    /** 現在位置の緯度 */
    private currentLocationLatitude: number = 0;
    /** 現在位置の経度 */
    private currentLocationLongitude: number = 0;
    /** 目的地の店名 */
    private _destination: string | null;
    /** 目的地の階層 */
    private _destinationFloor: number | null;
    /** 目的地の緯度 */
    private destinationLocationLatitude: number = 0;
    /** 目的地の経度 */
    private destinationLocationLongitude: number = 0;
    /** mapの描画場所 */
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    /**
     * @param floor 現在いる階
     * @param destination 目的地の店名
     * @param destinationFloor 目的地の階
     */
    constructor(
        floor: floor,
        destination: string | null = null,
        destinationFloor: number | null = null
    ) {
        this._floor = floor;
        this._destination = destination;
        this._destinationFloor = destinationFloor;

        // DBからデータの取得
        getDoc(doc(db, "map/map").withConverter(mapConverter))
            .then((res) => {
                // 成功時、クラス変数を初期化
                this.shopList = res.data()!;
                this.shopList.node.floor[this._floor].forEach((val) => {
                    if (val.name === this._destination) {
                        this.destinationLocationLatitude = val.latitude;
                        this.destinationLocationLongitude = val.longitude;
                    }
                });
                const img = new Image();
                img.src = `./images/map_${this._floor}.svg`;
                img.onload = () => {
                    this.canvas.width = img.width;
                    this.canvas.height = img.height;
                    if (destination && destinationFloor) {
                        this.dijkstra();
                    }
                };
            })
            .catch(() => {
                throw new Error("map data acquisition error");
            });

        // 現在地の追跡開始
        navigator.geolocation.watchPosition(
            (pos) => this.getCurrentLocation(pos),
            (e) => this.fall(e),
            {
                enableHighAccuracy: true,
            }
        );

        const canvas = document.querySelector("canvas");
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
        } else {
            throw new Error("canvas is not found");
        }
    }

    set floor(floor: floor) {
        this._floor = floor;
        const img = new Image();
        img.src = `./images/map_${this._floor}.svg`;
        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            if (this.shopList) {
                this.dijkstra();
            }
        };
    }

    set destination(destination: string | null) {
        this._destination = destination;
    }

    set destinationFloor(destinationFloor: number | null) {
        this._destinationFloor = destinationFloor;
    }

    private getCurrentLocation(pos: GeolocationPosition) {
        this.currentLocationLatitude = pos.coords.latitude;
        this.currentLocationLongitude = pos.coords.longitude;
    }

    fall(pos: GeolocationPositionError) {
        if (pos.code === 1) {
            alert("エラー\n位置情報取得の権限がありません");
        } else {
            alert("エラー\n位置情報が取得できませんでした");
        }
    }

    /**
     * ダイクストラ法による最短経路探索
     */
    async dijkstra() {
        // 目的地が存在しない場合は終了
        if (!(this._destination && this._destinationFloor)) {
            return;
        }
        const nowFloor = this._floor;
        let destinationIds = this.shopList.node.floor[this._floor]
            .map((val, i) => (val.name === this._destination ? i : undefined))
            .filter((v) => v !== undefined) as number[];

        const len = this.shopList.node.floor[this._floor].length;

        const f = () => {
            let min = 10e18;
            let id: number = -1;
            // 現在地に一番近いnodeを探索
            this.shopList.node.floor[this._floor].forEach((v, i) => {
                const tmp = distance(
                    this.currentLocationLatitude,
                    this.currentLocationLongitude,
                    v.latitude,
                    v.longitude
                );
                if (tmp < min) {
                    min = tmp;
                    id = i;
                }
            });
            /** 各nodeからnodeまでのコスト */
            const cost = this.shopList.edge.floor[4].map((v) => v.to);
            /** nodes[id]からの最短距離 */
            let nodes: number[] = new Array(len).fill(10e18);
            /** node[i]が探索済みか */
            let isSeen: boolean[] = new Array(len).fill(false);
            /** node[i]への最短経路の一つ手前 経路復元に使用する */
            let prev: number[] = new Array(len).fill(-1);
            nodes[id] = 0;

            // ダイクストラ法による探索
            // 参考:https://kuruton.hatenablog.com/entry/2020/12/02/080000
            while (true) {
                let v = -1;
                for (let i = 0; i < len; i++) {
                    if (!isSeen[i] && (v === -1 || nodes[i] < nodes[v])) {
                        v = i;
                    }
                }
                if (v === -1) {
                    break;
                }
                isSeen[v] = true;
                for (let i = 0; i < len; i++) {
                    if (nodes[i] > nodes[v] + cost[v][i]) {
                        nodes[i] = nodes[v] + cost[v][i];
                        prev[i] = v;
                    }
                }
            }

            return { nodes, prev };
        };

        // 目的地と現在地の階が同じでない場合
        if (this._floor !== this._destinationFloor) {
            destinationIds = this.shopList.node.floor[this._floor]
                .map((v, i) =>
                    v.is_elevator ||
                    v.is_stairs ||
                    (this._destinationFloor! > this._floor
                        ? v.is_up_escalator
                        : v.is_down_escalator)
                        ? i
                        : undefined
                )
                .filter((v) => v !== undefined) as number[];

            while (nowFloor === this._floor) {
                const { nodes, prev } = f();
                const min = Math.min(
                    ...nodes.filter((_, i) =>
                        destinationIds.some((a) => a === i)
                    )
                );

                const index = nodes
                    .map((v, i) =>
                        v === min && destinationIds.some((a) => a === i)
                            ? i
                            : undefined
                    )
                    .filter((v) => v !== undefined) as number[];

                index.forEach((v) => {
                    // 経路復元
                    let route: number[] = [];
                    let t = v;
                    while (t !== -1) {
                        route.push(t);
                        t = prev[t];
                    }
                    route.reverse();
                    this.show(route);
                });

                // 1秒停止
                await sleep(1000);
            }
        } else {
            // 目的地と現在地の階が同じの場合
            // 階が同じかつ、現在地と目的地の距離が遠い間ループ
            while (
                nowFloor === this._floor &&
                distance(
                    this.currentLocationLatitude,
                    this.currentLocationLongitude,
                    this.destinationLocationLatitude,
                    this.destinationLocationLongitude
                ) > 3
            ) {
                const { prev } = f();
                // 経路復元
                let route: number[] = [];
                let t = destinationIds[0];
                while (t !== -1) {
                    route.push(t);
                    t = prev[t];
                }
                route.reverse();
                this.show(route);
                // 1秒停止
                await sleep(1000);
            }
        }
    }

    show(route: number[] = []) {
        const a = this.shopList.node.floor[this._floor];
        // Map画像を長方形abcdとした際のあれのあれ
        /** 横のメートル */
        const ab = 15;
        /** 縦のメートル */
        const ac = 25;
        /** canvasの横幅(px) */
        const w = this.canvas.width;
        /** canvasの縦幅(px) */
        const h = this.canvas.height;
        /** canvasのpxとメートルの倍率 */
        const mag = w / ab;
        const [ulLat, ulLng] = this.shopList.origin;
        const [urLat, urLng] = this.shopList.upper_right;
        const [llLat, llLng] = this.shopList.lower_left;
        const [lrLat, lrLng] = this.shopList.lower_right;
        // カリー化
        const d =
            (lat1: number, lng1: number) => (lat2: number, lng2: number) =>
                distance(lat1, lng1, lat2, lng2);

        /**
         * 長方形abcd内の任意の点Pについて、xy座標とabcdからの距離を引数にとり、Pとの誤差を返す関数
         * @param x x
         * @param y y
         * @param ar aからPまでの距離
         * @param br bからPまでの距離
         * @param cr cからPまでの距離
         * @param dr dからPまでの距離
         * @returns abcdからPへの距離とabcdからxyへの距離の誤差
         */
        const abcdP = (
            x: number,
            y: number,
            ar: number,
            br: number,
            cr: number,
            dr: number
        ) => {
            const a = Math.abs(ar * mag - Math.sqrt(x ** 2 + y ** 2));
            const b = Math.abs(br * mag - Math.sqrt((x - w) ** 2 + y ** 2));
            const c = Math.abs(cr * mag - Math.sqrt(x ** 2 + (y - h) ** 2));
            const d = Math.abs(
                dr * mag - Math.sqrt((x - w) ** 2 + (y - h) ** 2)
            );
            return a + b + c + d;
        };

        const points: [number, number][] = route.map((v) => {
            let [x, y] = [a[v].latitude, a[v].longitude];
            const f = d(x, y);
            const ar = f(ulLat, ulLng);
            const br = f(urLat, urLng);
            const cr = f(llLat, llLng);
            const dr = f(lrLat, lrLng);
            let min = 10e18;
            let [pointX, pointY] = [0, 0];
            const f2 = (x: number, y: number) => abcdP(x, y, ar, br, cr, dr);
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    if (min > f2(i, j)) {
                        min = f2(i, j);
                        pointX = i;
                        pointY = j;
                    }
                }
            }
            return [pointX, pointY];
        });

        // 描画をリセット
        this.canvas.width = this.canvas.width;
        if (points.length) {
            let [beforeX, beforeY] = points[0];
            this.ctx.fillStyle = "#f00";
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = "#f00";
            points.forEach((p, i) => {
                const [x, y] = p;
                if (i) {
                    // 線を引く
                    this.ctx.moveTo(beforeX, beforeY);
                    this.ctx.lineTo(x, y);
                }
                // 点を打つ
                this.ctx.fillRect(x - 5, y - 5, 10, 10);
                [beforeX, beforeY] = [x, y];
            });
            this.ctx.stroke();
        }
    }
}

export default FloorMap;
