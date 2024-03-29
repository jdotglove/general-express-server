import webpack from 'webpack';
import pathDev from 'path';
import nodeExternalsDev from 'webpack-node-externals';

module.exports = {
    entry: ['webpack/hot/poll?100', './src/index.ts'],
    watch: true,
    target: 'node',
    externals: [
        nodeExternalsDev({
            allowlist: ['webpack/hot/poll?100']
        })
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
};