const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        map: "./src/pages/map",
        login: "./src/pages/login",
        signup: "./src/pages/signup",
        adminSignup: "./src/admin/Signup",
        adminLogin: "./src/admin/Login",
        adminLogout: "./src/admin/Logout",
        lostChild: "./src/pages/lostChild",
        shopList: "./src/pages/shopList",
        shopEdit: "./src/pages/shopEdit",
        lostItem: "./src/pages/lostItem",
        congestion: "./src/pages/congestion",
        adminCheck: "./src/admin/check.ts",
        information: "./src/pages/information",
        top: "./src/pages/top",
        homeEdit: "./src/admin/HomeEdit",
        shop: "./src/pages/shop",
        sideMenu: "./src/components/SideMenu",
        camera: "./src/admin/Camera",
        backButton: "./src/components/BackButton",
        coupon: "./src/pages/coupon",
        couponEdit: "./src/admin/Coupon",
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
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: { url: false },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
