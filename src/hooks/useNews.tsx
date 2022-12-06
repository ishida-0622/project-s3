import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useState } from "react";
import { news, newsConverter } from "../types/firestoreTypes";
import { FirebaseError } from "firebase/app";

const useNews = () => {
    const [news, setNews] = useState<(news & { id: string })[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const getNews = useCallback(async () => {
        try {
            setNews(
                (
                    await getDocs(
                        collection(db, "news").withConverter(newsConverter)
                    )
                ).docs
                    .map((v) => {
                        return { ...v.data(), id: v.id };
                    })
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
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

    return { news, getNews, isLoading, error };
};

export default useNews;
