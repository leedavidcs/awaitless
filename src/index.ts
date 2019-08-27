import { chain } from "./chain";
import { doWhilst } from "./doWhilst";
import { forEach } from "./forEach";
import { map } from "./map";
import { toPromise } from "./toPromise";
import { whilst } from "./whilst";

export * from "./chain";
export * from "./doWhilst";
export * from "./forEach";
export * from "./map";
export * from "./toPromise";
export * from "./whilst";

type Awaitless = typeof chain & {
	chain: typeof chain;
	doWhilst: typeof doWhilst;
	forEach: typeof forEach;
	map: typeof map;
	toPromise: typeof toPromise;
	whilst: typeof whilst;
};

const awaitless: Awaitless = Object.assign(chain.bind({}), {
	chain,
	doWhilst,
	forEach,
	map,
	toPromise,
	whilst
});

export default awaitless;
