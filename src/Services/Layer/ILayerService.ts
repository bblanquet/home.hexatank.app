import { Application } from 'pixi.js';
import { LayerHandler } from './LayerHandler';
import { IGarbage } from '../IGarbage';
import { Viewport } from 'pixi-viewport';

export interface ILayerService extends IGarbage {
	Register(app: Application): void;
	Publish(): LayerHandler;
	GetViewport(): Viewport;
	PauseNavigation(): void;
	StartNavigation(): void;
}
