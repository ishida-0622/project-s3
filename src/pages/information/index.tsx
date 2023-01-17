import useLostChild from "../../hooks/useLostChild";
import useLostItem from "../../hooks/useLostItem";
import React from "react";
import { createRoot } from "react-dom/client";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LostChild from "./Child";
import LostItem from "./Item";

const Information = () => {
    const {
        lostItems,
        getLostItems,
        isLoading: isLostItemLoading,
    } = useLostItem();
    if (isLostItemLoading) getLostItems();

    const {
        lostChild,
        getLostChild,
        isLoading: isLostChildLoading,
    } = useLostChild();
    if (isLostChildLoading) getLostChild();

    return (
        <main
            style={{
                textAlign: "center",
            }}
        >
            <Tabs>
                <TabList>
                    <Tab>迷子</Tab>
                    <Tab>落とし物</Tab>
                </TabList>
                <TabPanel>
                    <LostChild
                        lostChild={lostChild}
                        isLoading={isLostChildLoading}
                    />
                </TabPanel>
                <TabPanel>
                    <LostItem
                        lostItems={lostItems}
                        isLoading={isLostItemLoading}
                    />
                </TabPanel>
            </Tabs>
        </main>
    );
};

const container = document.querySelector("#app")!;
const root = createRoot(container);
root.render(<Information />);
