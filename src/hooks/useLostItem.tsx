import { db } from "../firebase/firebaseConfig";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useCallback, useState } from "react";
import { lostItem, lostItemConverter } from "../types/firestoreTypes";
import { FirebaseError } from "firebase/app";

const useLostItem = () => {
    const [lostItems, setLostItems] = useState<(lostItem & { id: string })[]>(
        []
    );
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const getLostItems = useCallback(async () => {
        try {
            const q = query(
                collection(db, "lost_item"),
                where("is_resolve", "==", false)
            );
            const docs = (await getDocs(q.withConverter(lostItemConverter)))
                .docs;
            setLostItems(
                docs
                    .map((v) => {
                        return { ...v.data(), id: v.id };
                    })
                    .sort((a, b) => (a.date > b.date ? 1 : -1))
            );
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.code);
            } else if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Error");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { lostItems, getLostItems, isLoading, error };
};

export default useLostItem;
