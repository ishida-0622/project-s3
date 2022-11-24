import { FirestoreDataConverter } from "firebase/firestore";

export type shop = {
    name: string;
    is_camera: boolean;
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
        };
    };
    edge: {
        floor: {
            4: {
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
    text: string;
    is_resolve: boolean;
};

export const lostItemConverter: FirestoreDataConverter<lostItem> = {
    toFirestore: (lostItemData: lostItem) => {
        return {
            date: lostItemData.date,
            text: lostItemData.text,
            is_resolve: lostItemData.is_resolve,
        };
    },
    fromFirestore: (snapshot, options): lostItem => {
        const data = snapshot.data(options);
        return {
            date: data.date,
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
    is_resolve: boolean;
};

export const storeInfoConverter: FirestoreDataConverter<storeInfo> = {
    toFirestore: (storeInfoData: storeInfo) => {
        return {
            store_name: storeInfoData.store_name,
            store_logo: storeInfoData.store_logo,
            store_detail: storeInfoData.store_detail,
            is_resolve: storeInfoData.is_resolve,
        };
    },
    fromFirestore: (snapshot, options): storeInfo => {
        const data = snapshot.data(options);
        return {
            store_name: data.store_name, //店舗名
            store_logo: data.store_logo, //店舗のロゴ
            store_detail: data.store_detail, //店舗詳細
            is_resolve: data.is_resolve, //表示・非表表
        };
    },
};
