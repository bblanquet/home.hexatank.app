import { injectable } from 'inversify';
import { StageAssigner } from '../../Core/App/StageAssigner';
import { RenderingLayers } from '../../Core/Setup/Render/RenderingHandler';
import { ILayerService } from './ILayerService';
const Viewport = require('pixi-viewport').Viewport;

@injectable()
export class LayerService implements ILayerService {
	private _rendering: RenderingLayers;
	private _viewPort: any;

	Register(app: PIXI.Application): void {
		this._viewPort = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 2000,
			worldHeight: 1000,
			interaction: app.renderer.plugins.interaction
		});

		this._rendering = new StageAssigner().Assign(this._viewPort, app);
	}
	Publish(): RenderingLayers {
		return this._rendering;
	}

	GetViewport(): any {
		return this._viewPort;
	}

	PauseNavigation(): void {
		this._viewPort.plugins.pause('drag');
		this._viewPort.plugins.pause('pinch');
		this._viewPort.plugins.pause('wheel');
		this._viewPort.plugins.pause('decelerate');
	}

	StartNavigation(): void {
		this._viewPort.drag().pinch().wheel().decelerate();
	}

	Collect(): void {
		this._rendering.Clear();
	}
}
