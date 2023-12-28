import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import Dotenv from "dotenv-webpack";
import CopyPlugin from "copy-webpack-plugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

export default function config(env, argv) {
    const __dirname = path.resolve();
    const tsConfigPath = path.resolve(__dirname, "./tsconfig.json"); //절대경로 선언 상속
    const production = argv.mode == "production";

    return {
        mode: argv.mode,
        devtool: production ? "source-map" : "cheap-module-source-map",
        entry: path.join(__dirname, "./src/index.tsx"),
        devServer: {
            historyApiFallback: true,
            port: 4000,
        },
        output: {
            clean: true,
            chunkFilename: "[name].[chunkhash].js",
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.m?js/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    use: "babel-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.(sa|sc|c)ss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.(png|svg)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "images/[name].[ext]?[hash]",
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "public/index.html",
            }),
            new Dotenv({ path: `./.env.${env.api}` }),
            // new CopyPlugin({
            //     patterns: [{ from: "public/assets/", to: "assets/" }],
            // }),
            new WebpackManifestPlugin({
                fileName: ".json",
                basePath: "/",
                publicPath: "/",
            }),
        ],
        resolve: {
            modules: [path.resolve(__dirname, "src"), "node_modules"],
            extensions: [".ts", ".tsx", ".js"],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: tsConfigPath,
                }),
            ],
        },
        optimization: {
            minimizer: [new TerserPlugin()],
        },
    };
}
