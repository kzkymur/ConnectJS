import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import keysTransformer from 'ts-transformer-keys/transformer';

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

export default {
  mode: 'development',
  entry: [
    'react-hot-loader/patch', 
    src + '/index.tsx'
  ],
  output: {
    path: dist,
    filename: 'bundle.js'
  },

  devtool: 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(t|j)(s|sx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: program => ({
                before: [
                  keysTransformer(program)
                ]
              })
            }
          }
        ],
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: { '@': src, }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html'
    })
  ]
}
