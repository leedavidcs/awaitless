export const toPromise = <T>(
	fn: (...args: any[]) => void,
	thisArg?: any
): ((...args: any[]) => Promise<T>) => {
	const { length, name } = fn;

	return (...args: any[]): Promise<T> =>
		new Promise<T>((resolve, reject) => {
			const promisifiedFnArgsLength = length - 1;

			if (args.length !== promisifiedFnArgsLength) {
				return reject(
					`Function ${name} as promise requires ${promisifiedFnArgsLength} arguments. ` +
						`Received ${args.length}`
				);
			}

			fn.bind(thisArg)(...args, (err, result) => (err ? reject(err) : resolve(result)));
		});
};
