export const mockBaseURL = 'http://localhost:3000';

// 辅助函数
export const untilCbCalled = <T>(setCb: (cb: (arg: T) => void, ...others: any[]) => void, ...args: any[]) =>
	new Promise<T>(resolve => {
		setCb(d => {
			resolve(d);
		}, ...args);
	});
