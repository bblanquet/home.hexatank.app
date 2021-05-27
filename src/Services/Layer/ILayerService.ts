import { RenderingLayers } from '../../Core/Setup/Render/RenderingLayers';
import { IGarbage } from '../IGarbage';

export interface ILayerService extends IGarbage {
	Register(app: PIXI.Application): void;
	Publish(): RenderingLayers;
	GetViewport(): any;
	PauseNavigation(): void;
	StartNavigation(): void;
}
