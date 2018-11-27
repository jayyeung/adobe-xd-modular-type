module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname,
        filename: 'main.js',
        libraryTarget: "commonjs2"
    },
    devtool: 'none',

    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: [ 
                        'transform-decorators-legacy',
                        'transform-class-properties',
                        'transform-object-rest-spread',
                        'transform-react-jsx'
                    ]
                }
            },
            {
                test: /\.scss?/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    'sass-loader'
                ]
            }
        ]
    },

    // Adobe XD API externals
    externals: {
        scenegraph: 'scenegraph',
        commands: 'commands'
    }
}