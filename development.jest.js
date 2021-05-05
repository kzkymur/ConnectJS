import path from 'path'
const src  = path.resolve(__dirname, 'src');

module.exports = {
  moduleFileExtensions: [ 'ts', 'js', 'tsx', 'jsx' ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", "babel-jest"],
    ".+\\.(sa|sc|c)ss$": "jest-css-modules-transform"
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    }
  },
  testMatch: [ "**/tests/**/*.ts", "**/tests/**/*.tsx" ],
  moduleNameMapper: {
    '^@/(.*)$': `${src}/$1`,
  },
}
