import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { news, newsConverter } from "../../types/firestoreTypes";
import News from "./News";

const Top = () => {
    const [news, setNews] = useState<(news & { id: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useLayoutEffect(() => {
        (async () => {
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
        })();
        setIsLoading(false);
    }, []);

    return (
        <main>
            <h2>Nagumo S3</h2>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {news.map((val) => (
                        <News
                            key={val.id}
                            title={val.title}
                            text={val.text}
                            image={val.image}
                            date={val.date}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<Top />);
