/*
 * @Date: 2020-04-09 11:06:01
 * @LastEditors: JOU(wx: huzhen555)
 * @LastEditTime: 2023-05-08 23:00:03
 */
var typescript = require('rollup-plugin-typescript2');
var { readFileSync } = require('fs');

const getCompiler = (
	opt = {
		// objectHashIgnoreUnknownHack: true,
		// clean: true,
		tsconfigOverride: {
			compilerOptions: {
				module: 'ES2015'
			}
		}
	}
) => typescript(opt);
exports.getCompiler = getCompiler;

const pkg = require('../package.json');
const version = process.env.VERSION || pkg.version;
const author = pkg.author;
const repository = pkg.repository.url.replace('git', 'https').replace('.git', '');
exports.banner = `/**
  * ${pkg.name} ${version} (${pkg.homepage})
  * Copyright ${new Date().getFullYear()} ${author}. All Rights Reserved
  * Licensed under MIT (${repository}/blob/master/LICENSE)
  */
`;

const compilePath = (exports.compilePath = {
	external: ['alova', 'axios'],
	packageName: 'AlovaAdapterAxios',
	input: 'src/index.ts',
	output: suffix => `dist/alova-adapter-axios.${suffix}.js`
});
exports.external = compilePath.external;
