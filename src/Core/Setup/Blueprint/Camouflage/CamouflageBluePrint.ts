import { IBlueprint } from '../IBlueprint';
import { MapEnv } from '../MapEnv';
import { MapItem } from '../MapItem';

export class CamouflageBluePrint implements IBlueprint {
	public Items: Array<MapItem>;
	public CenterItem: MapItem;
	public Departure: MapItem;
	public Arrival: MapItem;
	public MapMode: MapEnv;
	public PlayerName: string = '';
	constructor() {}
}
