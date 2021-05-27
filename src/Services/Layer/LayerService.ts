import { RenderingLayers } from '../../Core/Setup/Render/RenderingLayers';
import { ILayerService } from './ILayerService';
import { Viewport } from 'pixi-viewport';

export class LayerService implements ILayerService {
	private _rendering: RenderingLayers;
	private _viewPort: Viewport;

	Register(app: PIXI.Application): void {
		this.SetViewport(app);
		this._rendering = new RenderingLayers(this._viewPort, app.stage);
		this.StartNavigation();
		app.stage.addChild(this._viewPort);
	}
	private SetViewport(app: PIXI.Application) {
		this._viewPort = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 2000,
			worldHeight: 1000,
			interaction: app.renderer.plugins.interaction
		});
		this._viewPort.on('zoomed', (e: any) => {
			if (this._viewPort.scale.x < 0.7) {
				this._viewPort.setZoom(0.7, true); //this._viewPort.center
				return;
			} else if (this._viewPort.scale.x > 1.5) {
				this._viewPort.setZoom(1.5, true); //this._viewPort.center
				return;
			}
		});
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
