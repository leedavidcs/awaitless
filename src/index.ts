import { chain } from "./chain";
import { doWhilst } from "./doWhilst";
import { forEach } from "./forEach";
import { map } from "./map";
import { reduce } from "./reduce";
import { toPromise } from "./toPromise";
import { whilst } from "./whilst";

export * from "./chain";
export * from "./doWhilst";
export * from "./forEach";
export * from "./map";
export * from "./reduce";
export * from "./toPromise";
export * from "./whilst";

type Awaitless = typeof chain & {
	chain: typeof chain;
	doWhilst: typeof doWhilst;
	forEach: typeof forEach;
	map: typeof map;
	reduce: typeof reduce;
	toPromise: typeof toPromise;
	whilst: typeof whilst;
};

const awaitless: Awaitless = Object.assign(chain.bind({}), {
	chain,
	doWhilst,
	forEach,
	map,
	reduce,
	toPromise,
	whilst
});

export default awaitless;
