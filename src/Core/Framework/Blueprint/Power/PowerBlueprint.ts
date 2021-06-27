import { MapEnv } from '../Items/MapEnv';
import { MapItem } from '../Items/MapItem';
import { IBlueprint } from './../IBlueprint';
export class PowerBlueprint implements IBlueprint {
	public Items: MapItem[];
	public MapMode: MapEnv;
	public CenterItem: MapItem;
	public Arrival: MapItem;
	public Goal: MapItem;
}
