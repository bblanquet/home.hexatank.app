import { MapItemPair } from './MapItemPair';
import { IBlueprint } from '../IBlueprint';
import { MapEnv } from '../Items/MapEnv';
import { MapItem } from '../Items/MapItem';

export class CamouflageBlueprint implements IBlueprint {
	public Items: Array<MapItem>;
	public CenterItem: MapItem;
	public Goal: MapItemPair;
	public Patrols: MapItemPair[];
	public MapMode: MapEnv;
	public PlayerName: string = '';
	constructor() {}
}
