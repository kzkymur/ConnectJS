import path from 'path'
const src  = path.resolve(__dirname, 'src');

module.exports = {
  moduleFileExtensions: [ 'ts', 'js', ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testMatch: [ "**/tests/**/*.ts" ],
  moduleNameMapper: {
    '^@/(.*)$': `${src}/$1`,
  },
}
