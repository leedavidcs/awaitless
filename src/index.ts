import { chain } from "./chain";
import { forEach } from "./forEach";
import { map } from "./map";
import { toPromise } from "./toPromise";

export * from "./chain";
export * from "./forEach";
export * from "./map";
export * from "./toPromise";

type Awaitless = typeof chain & {
	forEach: typeof forEach;
	map: typeof map;
	toPromise: typeof toPromise;
};

const awaitless: Awaitless = Object.assign(chain.bind({}), {
	forEach,
	map,
	toPromise
});

export default awaitless;
