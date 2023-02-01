import useNews from "../../hooks/useNews";
import React from "react";
import { createRoot } from "react-dom/client";
import AddNewsModal from "./AddNewsModal";
import { FirebaseError } from "firebase/app";
import News from "./News";

const HomeEdit = () => {
    const { news, getNews, isLoading } = useNews();
    if (isLoading) getNews();

    return (
        <main style={{ textAlign: "center" }}>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : (
                <>
                    <div style={{ textAlign: "left" }}>
                        <button
                            onClick={() => history.back()}
                            style={{
                                fontSize: "1rem",
                                padding: ".5rem 1rem",
                                border: "1px solid #ccc",
                                backgroundColor: "#dbffdb",
                                borderRadius: ".5rem",
                                width: "5.5rem",
                                marginTop: "1%",
                            }}
                        >
                            戻る
                        </button>
                    </div>
                    {news.map((val) => (
                        <News
                            key={val.id}
                            title={val.title}
                            text={val.text}
                            image={val.image}
                            date={val.date}
                            id={val.id}
                            afterNewsDelete={getNews}
                            afterNewsUpdate={getNews}
                        />
                    ))}
                    <AddNewsModal
                        buttonValue="追加"
                        successFunc={() => getNews()}
                        failFunc={(e) => {
                            if (e instanceof FirebaseError) {
                                alert(
                                    `エラー\n下記の内容と共に問い合わせをお願い致します\n${e.code}`
                                );
                            } else if (e instanceof Error) {
                                alert(
                                    `エラー\n下記の内容と共に問い合わせをお願い致します\n${e.message}`
                                );
                            } else {
                                alert(
                                    "不明なエラー\n問い合わせをお願い致します"
                                );
                            }
                        }}
                    ></AddNewsModal>
                </>
            )}
        </main>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<HomeEdit />);
