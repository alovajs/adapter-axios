/*
 * @Date: 2020-04-09 11:06:01
 * @LastEditors: JOU(wx: huzhen555)
 * @LastEditTime: 2022-06-12 09:51:56
 */
// rollup.config.js
// commonjs
const config = require('./rollup.cjs');
const paths = config.compilePath;
const moduleType = 'common';

module.exports = {
	input: paths.input,
	output: {
		name: paths.packageName,
		file: paths.output(moduleType, 'cjs'),
		format: 'cjs',
		// When export and export default are not used at the same time, set legacy to true.
		// legacy: true,
		banner: config.banner
	},
	external: config.external,
	plugins: [
		config.getCompiler({
			tsconfigOverride: {
				compilerOptions: {
					declaration: true,
					module: 'ES2015'
				}
			},
			useTsconfigDeclarationDir: true
		})
	]
};
