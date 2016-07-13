'use strict';

const path = require('path'),
    webpack = require('webpack');

const isProduction = process.env['NODE_ENV'] === 'production',
    vendorPaths = /\/(frontend\/javascripts\/vendor|node_modules)\//;

let config = {
    devtool: 'cheap-module-source-map',
    context: path.join(__dirname, 'app/frontend/javascripts'),
    entry: {
        app: './entry.js',
        vendor: [
            'babel-polyfill',
            './framework.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'public/assets'),
        filename: '[name].js',
        devtoolModuleFilenameTemplate: '[resourcePath]',
        devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]',

        // if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
        publicPath: "/assets/"
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules', 'app/images'],
        alias: { cldr: 'cldrjs/dist/cldr' }
    },
    module: {
        preLoaders: [
            { test: /\.jsx?$/, exclude: vendorPaths, loader: 'babel-loader' }
        ],
        loaders: [
            { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
            { test: require.resolve('react'), loader: 'expose?React' },
            { test: require.resolve('moment'), loader: 'expose?moment' },
            { test: require.resolve('react-bootstrap'), loader: 'expose?ReactBoostrap' },
            { test: require.resolve('globalize'), loaders: ['imports?define=>false', 'expose?Globalize'] },
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /.scss$/, loader: "style!css!sass?outputStyle=expanded&imagePath=/assets/images"},
            { test: /\.css$/, loader: "style!css" },
            { test: /\.png$/, loader: "url?limit=100000" },
            { test: /\.(jpg|gif)$/, loader: "file" },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: `vendor${isProduction ? '-[chunkhash]' : ''}.js`,
            minChunks: m => m.resource && vendorPaths.test(m.resource)
        })
    ],
    watchOptions: {
        ignored: /node_modules/
    },
    devServer: {
        proxy: {
            '*': { target: 'http://localhost:3000/' }
        }
    }
};

if (isProduction) {
    const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

    config.output.filename = '[name]-bundle-[chunkhash].js';
    config.output.chunkFilename = '[id]-bundle-[chunkhash].js';

    config.plugins.unshift(new ChunkManifestPlugin({
        filename: 'webpack-common-manifest.json',
        manifestVariable: 'webpackBundleManifest'
    }));
    config.plugins.unshift(new webpack.optimize.DedupePlugin());
    config.plugins.unshift(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
    config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

module.exports = config;