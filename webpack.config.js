const path = require("path");
const glob = require("glob");
const entries = glob.sync("./dist/**/*.tsx");

module.exports = {
    mode: "production",
    entry: {
        // test: "./src/pages/map",
        login: "./src/pages/login",
        signup: "./src/pages/signup",
        lostItem: "./src/pages/lostItem",
        lostChild: "./src/pages/lostChild",
        lostChildCustomer: "./src/pages/lostChild/customer",
        lostItemCustomer:"./src/pages/lostItem/customer",
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
