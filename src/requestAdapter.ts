import { ProgressUpdater } from 'alova';
import axios from 'axios';
import { AxiosRequestAdapter } from '../typings';
import { noop, undefinedValue } from './helper';

/**
 * axios请求适配器
 */
export default function requestAdapter() {
	const adapter: AxiosRequestAdapter = (_, method) => {
		const { config } = method;
		const controller = new AbortController();
		let downloadHandler: ProgressUpdater = noop;
		let uploadHandler: ProgressUpdater = noop;

		const responsePromise = axios({
			url: method.url,
			method: method.type,
			baseURL: method.baseURL,
			data: method.data,
			signal: controller.signal,
			// `onUploadProgress` 允许为上传处理进度事件
			onUploadProgress: config.enableUpload
				? event => {
						uploadHandler(event.loaded, event.total || 1);
				  }
				: undefinedValue,
			// `onDownloadProgress` 允许为下载处理进度事件
			onDownloadProgress: config.enableDownload
				? event => {
						downloadHandler(event.loaded, event.total || 1);
				  }
				: undefinedValue,
			...config
		});

		return {
			response: () => responsePromise,
			headers: () => responsePromise.then(res => res.headers),
			abort: () => {
				controller.abort();
			},
			onDownload: handler => {
				downloadHandler = handler;
			},
			onUpload: handler => {
				uploadHandler = handler;
			}
		};
	};
	return adapter;
}
