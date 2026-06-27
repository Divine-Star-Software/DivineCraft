const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "production",
    target: "web",
    entry: "./src/index.ts",
    plugins: [
      new HTMLWebpackPlugin({
        template: "./src/index.html",
      }),
      new webpack.DefinePlugin({
        APP_ENV: JSON.stringify("dev"),
      }),
    ],
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "../dist"),
      globalObject: "this",
    },
    externals: {

    },
    experiments: {
      topLevelAwait: true,
    },

    watch: true,
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: "./src/tsconfig.json",
          extensions: [".ts", ".tsx", ".js", ".css"],
        }),
      ],
      extensions: [".tsx", ".ts", ".js", ".css"],
      fallback: {
        fs: false,
        path: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
                configFile: path.resolve(__dirname, "src/tsconfig.json"),
                context: path.resolve(__dirname, "src"),
                reportFiles: ["src/**/*.{ts,tsx}"],
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: "html-loader",
        },
        {
          test: /\.(js|jsx)$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  },
];
