import { FirestoreDataConverter } from "firebase/firestore";

export type user = {
    type: "user" | "admin" | "moll_admin";
};

export const userConverter: FirestoreDataConverter<user> = {
    toFirestore: (userData: user) => {
        return {
            type: userData.type,
        };
    },
    fromFirestore: (snapshot, options?): user => {
        const data = snapshot.data(options);
        return {
            type: data.type,
        };
    },
};

export type admin = {
    date: string;
    password: string;
    uid: string;
};

export const adminConverter: FirestoreDataConverter<admin> = {
    toFirestore: (adminData: admin) => {
        return {
            date: adminData.date,
            password: adminData.password,
            uid: adminData.uid,
        };
    },
    fromFirestore: (snapshot, options?): admin => {
        const data = snapshot.data(options);
        return {
            date: data.date,
            password: data.password,
            uid: data.uid,
        };
    },
};

export type map = {
    origin: [number, number];
    upper_right: [number, number];
    lower_left: [number, number];
    lower_right: [number, number];
    /** node[i][j] i階のidがjの店、エレベーター等 */
    node: {
        floor: {
            4: {
                name: string;
                // id: number;
                latitude: number;
                longitude: number;
                is_elevator: boolean;
                is_up_escalator: boolean;
                is_down_escalator: boolean;
                is_stairs: boolean;
            }[];
            5: {
                name: string;
                // id: number;
                latitude: number;
                longitude: number;
                is_elevator: boolean;
                is_up_escalator: boolean;
                is_down_escalator: boolean;
                is_stairs: boolean;
            }[];
            6: {
                name: string;
                // id: number;
                latitude: number;
                longitude: number;
                is_elevator: boolean;
                is_up_escalator: boolean;
                is_down_escalator: boolean;
                is_stairs: boolean;
            }[];
        };
    };
    edge: {
        floor: {
            4: {
                to: number[];
            }[];
            5: {
                to: number[];
            }[];
            6: {
                to: number[];
            }[];
        };
    };
};

export const mapConverter: FirestoreDataConverter<map> = {
    toFirestore: (mapData: map) => {
        return {
            node: mapData.node,
            edge: mapData.edge,
        };
    },
    fromFirestore: (snapshot, options): map => {
        const data = snapshot.data(options);
        return {
            origin: data.origin,
            upper_right: data.upper_right,
            lower_left: data.lower_left,
            lower_right: data.lower_right,
            node: data.node,
            edge: data.edge,
        };
    },
};

export type lostItem = {
    date: string;
    title: string;
    text: string;
    is_resolve: boolean;
};

export const lostItemConverter: FirestoreDataConverter<lostItem> = {
    toFirestore: (lostItemData: lostItem) => {
        return {
            date: lostItemData.date,
            title: lostItemData.title,
            text: lostItemData.text,
            is_resolve: lostItemData.is_resolve,
        };
    },
    fromFirestore: (snapshot, options): lostItem => {
        const data = snapshot.data(options);
        return {
            date: data.date,
            title: data.title,
            text: data.text,
            is_resolve: data.is_resolve,
        };
    },
};

export type lostChild = {
    date: string;
    title: string;
    text: string;
    is_resolve: boolean;
};

export const lostChildConverter: FirestoreDataConverter<lostChild> = {
    toFirestore: (lostChildData: lostChild) => {
        return {
            date: lostChildData.date,
            title: lostChildData.title,
            text: lostChildData.text,
            is_resolve: lostChildData.is_resolve,
        };
    },
    fromFirestore: (snapshot, options): lostChild => {
        const data = snapshot.data(options);
        return {
            date: data.date,
            title: data.title,
            text: data.text,
            is_resolve: data.is_resolve,
        };
    },
};

export type storeInfo = {
    store_name: string;
    store_logo: string;
    store_detail: string;
    tag: string[];
    floor: number;
    is_camera: boolean;
    is_sale: boolean;
    is_hidden: boolean;
};

export const storeInfoConverter: FirestoreDataConverter<storeInfo> = {
    toFirestore: (storeInfoData: storeInfo) => {
        return {
            store_name: storeInfoData.store_name,
            store_logo: storeInfoData.store_logo,
            store_detail: storeInfoData.store_detail,
            tag: storeInfoData.tag,
            floor: storeInfoData.floor,
            is_camera: storeInfoData.is_camera,
            is_sale: storeInfoData.is_sale,
            is_hidden: storeInfoData.is_hidden,
        };
    },
    fromFirestore: (snapshot, options): storeInfo => {
        const data = snapshot.data(options);
        return {
            store_name: data.store_name, //店舗名
            store_logo: data.store_logo, //店舗のロゴ
            store_detail: data.store_detail, //店舗詳細
            tag: data.tag, // 検索タグ
            floor: data.floor, // 店舗の階層
            is_camera: data.is_camera, // 混雑状況カメラの有無
            is_sale: data.is_sale, // セール中か
            is_hidden: data.is_hidden, //表示・非表表
        };
    },
};

export type news = {
    title: string;
    text: string;
    image: string;
    date: string;
};

export const newsConverter: FirestoreDataConverter<news> = {
    toFirestore: (newsData: news) => {
        return {
            title: newsData.title,
            text: newsData.text,
            image: newsData.image,
            date: newsData.date,
        };
    },
    fromFirestore: (snapshot, options): news => {
        const data = snapshot.data(options);
        return {
            title: data.title,
            text: data.text,
            image: data.image,
            date: data.date,
        };
    },
};
