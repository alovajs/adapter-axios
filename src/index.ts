import ReactHook from 'alova/react';
import { AdapterTaroOptions } from '../typings';
import requestAdapter from './requestAdapter';
import storageAdapter from './storageAdapter';
export { default as taroMockResponse } from './mockResponse';
export { default as taroRequestAdapter } from './requestAdapter';
export { default as taroStorageAdapter } from './storageAdapter';

export default function AdapterTaro({ mockRequest }: AdapterTaroOptions = {}) {
	return {
		statesHook: ReactHook,
		requestAdapter: mockRequest || requestAdapter,
		storageAdapter
	};
}
