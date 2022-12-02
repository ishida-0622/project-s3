import React, { useMemo } from "react";
import { lostItem } from "../../types/firestoreTypes";

const LostItem = (props: { lostItems: lostItem[]; isLoading: boolean }) => {
    return useMemo(
        () => (
            <>
                {props.isLoading ? (
                    <h2>Now Loading...</h2>
                ) : (
                    <>
                        {props.lostItems.map((item) => {
                            return (
                                <div
                                    className="post"
                                    key={item.date + item.text}
                                >
                                    <h3 className="post-title">{item.title}</h3>
                                    <p className="post-date">{item.date}</p>
                                    <p className="post-text">{item.text}</p>
                                </div>
                            );
                        })}
                    </>
                )}
            </>
        ),
        [props.lostItems]
    );
};

export default LostItem;
