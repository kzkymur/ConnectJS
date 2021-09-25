module.exports = {
  presets: [
    "@babel/preset-env", "@babel/preset-react"
  ],
  plugins: [ 
    "@babel/plugin-proposal-class-properties", // private変数
    "react-hot-loader/babel"
  ] 
}
