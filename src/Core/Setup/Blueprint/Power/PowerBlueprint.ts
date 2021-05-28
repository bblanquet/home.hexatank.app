import { MapEnv } from '../MapEnv';
import { MapItem } from '../MapItem';
import { IBlueprint } from './../IBlueprint';
export class PowerBlueprint implements IBlueprint {
	public Items: MapItem[];
	public MapMode: MapEnv;
	public CenterItem: MapItem;
	public Arrival: MapItem;
	public Goal: MapItem;
}
