import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'lib/index.js',
  external: ['bluebird', 'xml2js'],
  plugins: [
    babel({
      exclude: ['node_modules/**', 'package.json'],
      babelrc: false,
      presets: ['es2015-rollup'],
    }),
    json(),
    nodeResolve({ jsnext: true, main: true, skip: ['knex'] }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
}
