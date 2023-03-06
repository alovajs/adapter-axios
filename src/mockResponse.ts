import { MockError, MockResponse } from '@alova/mock';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { AlovaAxiosRequestConfig } from '../typings';
import { undefinedValue } from './helper';

const mockResponseHandler: MockResponse<AlovaAxiosRequestConfig, AxiosResponse, AxiosResponse['headers']> = (
	{ status, statusText, body },
	_,
	currentMethod
) => {
	const responseHeaders = {};
	const { config } = currentMethod;
	const axiosConfig = {
		baseURL: currentMethod.baseURL,
		url: currentMethod.url,
		data: currentMethod.data,
		...config,
		headers: new AxiosHeaders(config.headers)
	};
	const axiosResponse = {
		data: body,
		status,
		statusText,
		headers: responseHeaders,
		config: axiosConfig
	};

	// 状态大于等于400时抛出错误
	if (status >= 400) {
		throw new AxiosError(statusText, 'ERR_BAD_REQUEST', axiosConfig, undefinedValue, axiosResponse);
	}
	return {
		response: axiosResponse,
		headers: responseHeaders
	};
};

const mockErrorHandler: MockError = (error, currentMethod) => {
	const { config } = currentMethod;
	return new AxiosError(error.message, 'ERR_NETWORK', {
		baseURL: currentMethod.baseURL,
		url: currentMethod.url,
		data: currentMethod.data,
		...config,
		headers: new AxiosHeaders(config.headers)
	});
};

export default {
	onMockResponse: mockResponseHandler,
	onMockError: mockErrorHandler
};
