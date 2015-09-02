module.exports = {
  entry: './index.js',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'bundle.ignored.js',
    path: __dirname
  },
  target: 'node',
  externals: {
    tmp: 'commonjs tmp'
  },

  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/},
      {test: /\.sh$/, loaders: ['raw'], exclude: /node_modules/}
    ]
  }
};
