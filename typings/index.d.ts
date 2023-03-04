import { AlovaRequestAdapter } from 'alova';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * axios请求配置参数
 */
export type AlovaAxiosRequestConfig = Omit<
	AxiosRequestConfig,
	'url' | 'method' | 'baseURL' | 'headers' | 'params' | 'data' | 'timeout' | 'cancelToken' | 'signal'
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
export declare const axiosRequestAdapter: AxiosRequestAdapter;

/**
 * 模拟响应适配器，它用于@alova/mock中，让模拟请求时也能返回Taro响应数据兼容的格式
 * @example
 * ```js
 * import AdapterTaro, { taroRequestAdapter } from '@alova/adapter-taro';
 *
 * const mockRequestAdapter = createAlovaMockAdapter([mocks], {
 *		delay: 1000,
 *		onMockResponse: mockResponse,
 *    httpAdapter: taroRequestAdapter
 * });
 *	const alovaInst = createAlova({
 *		baseURL: 'http://xxx',
 *		...AdapterTaro({
 *      mockAdapter: process.env.NODE_ENV === 'development' ? mockRequestAdapter : undefined
 *    }),
 *	});
 * ```
 */
export declare const axiosMockResponse: MockResponse<AlovaAxiosRequestConfig, AxiosResponse, AxiosResponse['headers']>;
