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
        <main>
            {isLoading ? (
                <h2>Now Loading...</h2>
            ) : (
                <>
                    {news.map((val) => (
                        <News
                            key={val.id}
                            title={val.title}
                            text={val.text}
                            image={val.image}
                            date={val.date}
                            id={val.id}
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
