import axios from 'axios';
import { AxiosRequestAdapter } from '../typings';

/**
 * Uniapp请求适配器
 */
const requestAdapter: AxiosRequestAdapter = (_, method) => {
	// const { url, data, type, headers: header } = elements;
	const responsePromise = axios({});

	return {
		response: () => responsePromise,
		headers: () => responsePromise.then(res => res.headers || {}),
		abort: () => {
			taskInstance.abort();
		},
		onDownload,
		onUpload
	};
};

export default requestAdapter;
