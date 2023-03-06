import { createAlova, useRequest } from 'alova';
import VueHook from 'alova/vue';
import { AxiosError } from 'axios';
import { readFileSync } from 'fs';
import path from 'path';
import { axiosRequestAdapter } from '../src/index';
import { Result } from './result.type';
import { mockServer } from './server';
import { mockBaseURL, untilCbCalled } from './utils';

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());
describe('request adapter', () => {
	test('should call axios and pass the right args', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			timeout: 100000,
			responsed(response) {
				const { status, data, config } = response;
				expect(status).toBe(200);
				expect(config.baseURL).toBe(mockBaseURL);
				expect(config.url).toBe('/unit-test');
				expect(config.method).toBe('get');
				expect(config.timeout).toBe(100000);
				expect(config.decompress).toBeTruthy();
				expect(config.xsrfCookieName).toBe('xsrf_cookie');
				expect(config.xsrfHeaderName).toBe('xsrf_header');
				expect(config.responseEncoding).toBe('utf8');
				expect(config.params).toStrictEqual({ a: '1', b: '2' });
				expect(config.data).toBeUndefined();
				return data;
			}
		});

		const Get = alovaInst.Get<Result>('/unit-test', {
			params: {
				a: '1',
				b: '2'
			},
			responseEncoding: 'utf8',
			decompress: true,
			xsrfCookieName: 'xsrf_cookie',
			xsrfHeaderName: 'xsrf_header'
		});

		const { loading, data, downloading, error, onSuccess } = useRequest(Get);
		expect(loading.value).toBeTruthy();
		expect(data.value).toBeUndefined();
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value).toBeUndefined();

		await untilCbCalled(onSuccess);
		expect(loading.value).toBeFalsy();
		expect(data.value.code).toBe(200);
		expect(data.value.data.method).toBe('GET');
		expect(data.value.data.params).toStrictEqual({
			a: '1',
			b: '2'
		});
		expect(data.value.data.path).toBe('/unit-test');
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value).toBeUndefined();
	});

	test('should call axios with post', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			responsed({ data }) {
				return data;
			}
		});

		const Post = alovaInst.Post<string>(
			'/unit-test',
			{ post1: 'p1', post2: 'p2' },
			{
				params: {
					a: '1',
					b: '2'
				},
				responseType: 'text',
				shareRequest: false
			}
		);

		const { loading, data, onSuccess } = useRequest(Post);
		await untilCbCalled(onSuccess);
		expect(loading.value).toBeFalsy();

		const dataObj = JSON.parse(data.value);
		expect(dataObj.code).toBe(200);
		expect(dataObj.data.method).toBe('POST');
		expect(dataObj.data.data).toStrictEqual({
			post1: 'p1',
			post2: 'p2'
		});
		expect(dataObj.data.path).toBe('/unit-test');
	});

	test('api not found when request', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			responsed({ data }) {
				return data;
			}
		});

		const Get = alovaInst.Get<Result>('/unit-test-404');
		const { loading, data, downloading, error, onError } = useRequest(Get);
		expect(loading.value).toBeTruthy();
		expect(data.value).toBeUndefined();
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value).toBeUndefined();

		const { error: errRaw } = await untilCbCalled(onError);
		expect(loading.value).toBeFalsy();
		expect(data.value).toBeUndefined();
		expect(error.value).toBeInstanceOf(AxiosError);
		expect(errRaw).toBeInstanceOf(AxiosError);
		expect(errRaw.response.status).toBe(404);
		expect(errRaw.response.statusText).toBe('api not found');
	});

	test('request fail with axios', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			responsed({ data }) {
				return data;
			}
		});

		const Get = alovaInst.Get<Result>('/unit-test-error');
		const { loading, data, downloading, error, onError } = useRequest(Get);
		expect(loading.value).toBeTruthy();
		expect(data.value).toBeUndefined();
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value).toBeUndefined();

		const { error: errRaw } = await untilCbCalled(onError);
		expect(loading.value).toBeFalsy();
		expect(data.value).toBeUndefined();
		expect(error.value).toBeInstanceOf(AxiosError);
		expect(errRaw).toBeInstanceOf(AxiosError);
		expect(error.value?.message).toMatch(/Network Error/);
	});

	test('should cancel request when call `controller.abort`', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			responsed({ data }) {
				return data;
			}
		});

		const Get = alovaInst.Get<Result>('/unit-test');
		const { loading, data, downloading, error, abort, onError } = useRequest(Get);
		expect(loading.value).toBeTruthy();
		expect(data.value).toBeUndefined();
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value).toBeUndefined();

		abort();
		await untilCbCalled(onError);
		expect(loading.value).toBeFalsy();
		expect(data.value).toBeUndefined();
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value?.message).toBe('canceled');
	});

	test('should upload file and pass the right args', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			responsed({ data }) {
				return data;
			}
		});

		// 使用formData上传文件
		const formData = new FormData();
		formData.append('f1', 'f1');
		formData.append('f2', 'f2');
		const imageFile = new File([readFileSync(path.resolve(__dirname, './image.jpg'))], 'file', {
			type: 'image/jpeg'
		});
		formData.append('file', imageFile);
		const Post = alovaInst.Post<Result<string>>('/unit-test', formData, {
			withCredentials: true
			// 设置上传回调后，msw无法接收请求
			// enableUpload: true
		});

		const { loading, data, uploading, downloading, error, onSuccess } = useRequest(Post);
		await untilCbCalled(onSuccess);
		expect(loading.value).toBeFalsy();
		expect(data.value.code).toBe(200);
		expect(data.value.data.method).toBe('POST');
		expect(data.value.data.path).toBe('/unit-test');
		expect(uploading.value).toEqual({ total: 0, loaded: 0 });
		expect(downloading.value).toEqual({ total: 0, loaded: 0 });
		expect(error.value).toBeUndefined();
	});

	test.only('should download file and pass the right args', async () => {
		const alovaInst = createAlova({
			baseURL: mockBaseURL,
			requestAdapter: axiosRequestAdapter(),
			statesHook: VueHook,
			responsed({ data }) {
				return data;
			}
		});

		const Get = alovaInst.Get('/unit-test-download', {
			enableDownload: true,
			responseType: 'blob'
		});

		const { loading, data, uploading, downloading, error, onSuccess } = useRequest(Get);
		const event = await untilCbCalled(onSuccess);
		console.log(event);
		expect(loading.value).toBeFalsy();
		expect(data.value).toBeInstanceOf(Buffer);
		expect(uploading.value).toEqual({ total: 0, loaded: 0 });
		expect(downloading.value).toEqual({ total: 3273178, loaded: 3273178 });
		expect(error.value).toBeUndefined();
	});
});
