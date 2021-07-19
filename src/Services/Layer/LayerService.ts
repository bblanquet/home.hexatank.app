import { RenderingLayers } from '../../Core/Framework/Render/RenderingLayers';
import { ILayerService } from './ILayerService';
import { Viewport } from 'pixi-viewport';
import { Application } from 'pixi.js';

export class LayerService implements ILayerService {
	private _rendering: RenderingLayers;
	private _viewPort: Viewport;

	Register(app: Application): void {
		this.SetViewport(app);
		this._rendering = new RenderingLayers(this._viewPort, app.stage);
		this.StartNavigation();
		app.stage.addChild(this._viewPort);
	}
	private SetViewport(app: Application) {
		this._viewPort = new Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 2000,
			worldHeight: 1000,
			interaction: app.renderer.plugins.interaction
		});
		(this._viewPort as any).on('zoomed', (e: any) => {
			if (this._viewPort.scale.x < 0.7) {
				this._viewPort.setZoom(0.7, true);
				return;
			} else if (this._viewPort.scale.x > 1.5) {
				this._viewPort.setZoom(1.5, true);
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
		this._viewPort.plugins.remove('drag');
		this._viewPort.plugins.remove('zoom');
		this._viewPort.plugins.remove('pinch');
		this._viewPort.plugins.remove('wheel');
		this._viewPort.plugins.remove('decelerate');
		this._viewPort.destroy();
		this._rendering.Clear();
	}
}
