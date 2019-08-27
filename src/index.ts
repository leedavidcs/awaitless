import { chain } from "./chain";
import { forEach } from "./forEach";
import { map } from "./map";
import { toPromise } from "./toPromise";
import { whilst } from "./whilst";

export * from "./chain";
export * from "./forEach";
export * from "./map";
export * from "./toPromise";
export * from "./whilst";

type Awaitless = typeof chain & {
	chain: typeof chain;
	forEach: typeof forEach;
	map: typeof map;
	toPromise: typeof toPromise;
	whilst: typeof whilst;
};

const awaitless: Awaitless = Object.assign(chain.bind({}), {
	chain,
	forEach,
	map,
	toPromise,
	whilst
});

export default awaitless;
