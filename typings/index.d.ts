import { MockError } from '@alova/mock';
import { AlovaRequestAdapter } from 'alova';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * axios请求配置参数
 */
export type AlovaAxiosRequestConfig = Omit<
	AxiosRequestConfig,
	| 'url'
	| 'method'
	| 'baseURL'
	| 'headers'
	| 'params'
	| 'data'
	| 'timeout'
	| 'cancelToken'
	| 'signal'
	| 'onUploadProgress'
	| 'onDownloadProgress'
>;

/**
 * axios请求适配器
 */
export type AxiosRequestAdapter = AlovaRequestAdapter<
	any,
	any,
	AlovaAxiosRequestConfig,
	AxiosResponse,
	AxiosResponse['headers']
>;

/**
 * axios请求适配器
 */
export declare function axiosRequestAdapter(): AxiosRequestAdapter;

/**
 * 模拟响应适配器，它用于@alova/mock中，让模拟请求时也能返回axios响应数据兼容的格式
 * @example
 * ```js
 * import { axiosRequestAdapter, axiosMockResponse } from '@alova/adapter-axios';
 *
 * const mockRequestAdapter = createAlovaMockAdapter([mocks], {
 *		delay: 1000,
 *    httpAdapter: axiosRequestAdapter(),
 * 		...axiosMockResponse
 * });
 *	const alovaInst = createAlova({
 *		baseURL: 'http://xxx',
 *		requestAdapter: process.env.NODE_ENV === 'development'
 *			? mockRequestAdapter
 *			: axiosRequestAdapter(),
 *	});
 * ```
 */
export declare const axiosMockResponse: {
	onMockResponse: MockResponse<AlovaAxiosRequestConfig, AxiosResponse, AxiosResponse['headers']>;
	onMockError: MockError;
};
