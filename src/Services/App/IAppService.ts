import * as PIXI from 'pixi.js';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';

export interface IAppService {
	Register(mapkind: MapKind): void;
	Publish(): PIXI.Application;
	Collect(): void;
}
