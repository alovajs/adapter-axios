// 给@tarojs/runtime补充全局变量
(global as any).ENABLE_INNER_HTML = true;
(global as any).ENABLE_ADJACENT_HTML = true;
(global as any).ENABLE_CLONE_NODE = true;
(global as any).ENABLE_CONTAINS = true;
(global as any).ENABLE_SIZE_APIS = true;
(global as any).ENABLE_TEMPLATE_CONTENT = true;

// 防止Vue warn打印
const warn = console.warn;
console.warn = (...args: any[]) => {
	args = args.filter((a: any) => !/vue warn/i.test(a));
	if (args.length > 0) {
		warn.apply(console, args);
	}
};
