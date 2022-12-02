import React, { useMemo } from "react";
import { lostChild } from "types/firestoreTypes";

const LostChild = (props: { lostChild: lostChild[]; isLoading: boolean }) => {
    return useMemo(
        () => (
            <>
                {props.isLoading ? (
                    <h2>Now Loading...</h2>
                ) : (
                    <>
                        {props.lostChild.map((child) => {
                            return (
                                <div
                                    className="post"
                                    key={child.date + child.text}
                                >
                                    <h3 className="post-title">
                                        {child.title}
                                    </h3>
                                    <p className="post-date">{child.date}</p>
                                    <p className="post-text">{child.text}</p>
                                </div>
                            );
                        })}
                    </>
                )}
            </>
        ),
        [props.lostChild]
    );
};

export default LostChild;
