import { MapEnv } from './MapEnv';
import { MapItem } from './MapItem';

export interface IBlueprint {
	Items: Array<MapItem>;
	MapMode: MapEnv;
}
