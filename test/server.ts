import { readFileSync } from 'fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import path from 'path';
import { mockBaseURL } from './utils';

// -------------------
// 服务模拟
const result = (code: number, req: any, res: any, ctx: any, hasBody = false, extraParams = {}) => {
	const ret = {
		code,
		msg: '',
		data: {
			path: req.url.pathname,
			method: req.method,
			params: {
				...(req.url.search || '')
					.replace('?', '')
					.split('&')
					.reduce((p: Record<string, any>, c: string) => {
						const [k, v] = c.split('=');
						p[k] = v;
						return p;
					}, {} as Record<string, any>),
				...extraParams
			}
		} as Record<string, any>
	};
	if (hasBody) {
		try {
			ret.data.data = req.body;
		} catch (error) {}
	}
	return res(ctx.json(ret));
};

export const mockServer = setupServer(
	rest.get(mockBaseURL + '/unit-test', (req, res, ctx) => result(200, req, res, ctx)),
	rest.get(mockBaseURL + '/unit-test-404', (_, res, ctx) => {
		return res(ctx.status(404, 'api not found'));
	}),
	rest.get(mockBaseURL + '/unit-test-error', () => {
		throw new Error('server error');
	}),
	rest.post(mockBaseURL + '/unit-test', (req, res, ctx) => {
		return result(200, req, res, ctx, true);
	}),
	rest.get(mockBaseURL + '/unit-test-download', (req, res, ctx) => {
		// Read the image from the file system using the "fs" module.
		const imageBuffer = readFileSync(path.resolve(__dirname, './image.jpg'));
		return res(
			ctx.set('Content-Length', imageBuffer.byteLength.toString()),
			ctx.set('Content-Type', 'image/jpeg'),
			// Respond with the "ArrayBuffer".
			ctx.body(imageBuffer)
		);
	})
);

// 防止Vue warn打印
const warn = console.warn;
console.warn = (...args: any[]) => {
	args = args.filter((a: any) => !/vue warn/i.test(a));
	if (args.length > 0) {
		warn.apply(console, args);
	}
};
