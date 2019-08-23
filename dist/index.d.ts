import { chain } from "./chain";
import { forEach } from "./forEach";
import { map } from "./map";
import { toPromise } from "./toPromise";
export * from "./chain";
export * from "./forEach";
export * from "./map";
export * from "./toPromise";
declare type Awaitless = typeof chain & {
    forEach: typeof forEach;
    map: typeof map;
    toPromise: typeof toPromise;
};
declare const awaitless: Awaitless;
export default awaitless;
