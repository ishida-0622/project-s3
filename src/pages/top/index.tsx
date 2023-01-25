import React from "react";
import { createRoot } from "react-dom/client";
import News from "./News";
import useNews from "../../hooks/useNews";

const Top = () => {
    const { news, getNews, isLoading } = useNews();
    if (isLoading) getNews();

    return (
        <main style={{ textAlign: "center" }}>
            <h1>TIC S3</h1>
            <h2>店舗ニュース</h2>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {news.length ? (
                        <>
                            {news.map((val) => (
                                <News
                                    key={val.id}
                                    title={val.title}
                                    text={val.text}
                                    image={val.image}
                                    date={val.date}
                                />
                            ))}
                        </>
                    ) : (
                        <p>ニュースがありません</p>
                    )}
                </div>
            )}
        </main>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<Top />);
