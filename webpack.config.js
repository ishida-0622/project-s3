const path = require("path");
const glob = require("glob");
const entries = glob.sync("./dist/**/*.tsx");

module.exports = {
    mode: "production",
    entry: {
        map: "./src/pages/map",
        login: "./src/pages/login",
        signup: "./src/pages/signup",
        // lostItem: "./src/pages/lostItem",
        lostChild: "./src/pages/lostChild",
        lostChildCustomer: "./src/pages/lostChild/customer",
        shopList: "./src/pages/shopList",
        shopEdit: "./src/pages/shopEdit",
        lostItemCustomer: "./src/pages/lostItem/customer",
        congestion: "./src/pages/congestion",
        // z: "./z.js",
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                loader: "ts-loader",
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: "file-loader",
                options: {},
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
