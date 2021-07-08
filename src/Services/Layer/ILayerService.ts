import { Application } from 'pixi.js';
import { RenderingLayers } from '../../Core/Framework/Render/RenderingLayers';
import { IGarbage } from '../IGarbage';

export interface ILayerService extends IGarbage {
	Register(app: Application): void;
	Publish(): RenderingLayers;
	GetViewport(): any;
	PauseNavigation(): void;
	StartNavigation(): void;
}
