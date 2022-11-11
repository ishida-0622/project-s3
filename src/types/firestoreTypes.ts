import { FirestoreDataConverter } from "firebase/firestore";

export type shop = {
    name: string;
    is_camera: boolean;
};

export type map = {
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
