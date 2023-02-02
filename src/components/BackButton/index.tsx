import React from "react";
import { createRoot } from "react-dom/client";

const BackButton = () => {
    return (
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
    );
};

const container = document.querySelector("#back")!;
const root = createRoot(container);
root.render(<BackButton />);
