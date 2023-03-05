import { MockResponse } from '@alova/mock';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { AlovaAxiosRequestConfig } from '../typings';

const mockResponseHandler: MockResponse<AlovaAxiosRequestConfig, AxiosResponse, AxiosResponse['headers']> = (
	{ status, statusText, body },
	_,
	currentMethod
) => {
	const responseHeaders = {};
	const { config } = currentMethod;
	return {
		response: {
			data: body,
			status,
			statusText,
			headers: responseHeaders,
			config: {
				baseURL: currentMethod.baseURL,
				url: currentMethod.url,
				data: currentMethod.data,
				...config,
				headers: new AxiosHeaders(config.headers)
			}
		},
		headers: responseHeaders
	};
};
export default mockResponseHandler;
