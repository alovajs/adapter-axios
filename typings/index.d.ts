import { MockError } from '@alova/mock';
import { AlovaRequestAdapter } from 'alova';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * axios请求配置参数
 */
export type AlovaAxiosRequestConfig = Omit<
	AxiosRequestConfig,
	| 'url'
	| 'method'
	| 'baseURL'
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

interface AdapterCreateOptions {
	axios?: AxiosInstance;
}
/**
 * axios请求适配器
 * @param options 选项参数
 */
export declare function axiosRequestAdapter(options?: AdapterCreateOptions): AxiosRequestAdapter;

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
