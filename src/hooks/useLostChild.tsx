import { db } from "../firebase/firebaseConfig";
import { query, collection, where, getDocs } from "firebase/firestore";
import { useCallback, useState } from "react";
import { lostChild, lostChildConverter } from "../types/firestoreTypes";
import { FirebaseError } from "firebase/app";

const useLostChild = () => {
    const [lostChild, setLostChild] = useState<(lostChild & { id: string })[]>(
        []
    );
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const getLostChild = useCallback(async () => {
        try {
            const q = query(
                collection(db, "lost_child"),
                where("is_resolve", "==", false)
            );
            const docs = (await getDocs(q.withConverter(lostChildConverter)))
                .docs;
            setLostChild(
                docs
                    .map((v) => {
                        return { ...v.data(), id: v.id };
                    })
                    .sort((a, b) => (a.date > b.date ? 1 : -1))
            );
            setIsLoading(false);
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.code);
            } else if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Error");
            }
        }
    }, []);

    return { lostChild, getLostChild, isLoading, error };
};

export default useLostChild;
