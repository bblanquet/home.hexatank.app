import { IBlueprint } from '../IBlueprint';
import { MapEnv } from '../Items/MapEnv';
import { MapItem } from '../Items/MapItem';
import { DiamondHq } from './DiamondHq';

export class GameBlueprint implements IBlueprint {
	public Items: Array<MapItem>;
	public CenterItem: MapItem;
	public Hqs: Array<DiamondHq>;
	public MapMode: MapEnv;
	public PlayerName: string = '';
	constructor() {}
}
