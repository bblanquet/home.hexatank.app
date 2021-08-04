import { Application } from 'pixi.js';
import { LayerHandler } from './LayerHandler';
import { IGarbage } from '../IGarbage';

export interface ILayerService extends IGarbage {
	Register(app: Application): void;
	Publish(): LayerHandler;
	GetViewport(): any;
	PauseNavigation(): void;
	StartNavigation(): void;
}
