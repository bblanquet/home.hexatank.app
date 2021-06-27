import { MapEnv } from './Items/MapEnv';
import { MapItem } from './Items/MapItem';

export interface IBlueprint {
	Items: Array<MapItem>;
	MapMode: MapEnv;
}
