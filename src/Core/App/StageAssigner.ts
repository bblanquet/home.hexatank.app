import { RenderingLayers } from '../Setup/Render/RenderingHandler';

export class StageAssigner {
	public Assign(viewPort: any, app: PIXI.Application): RenderingLayers {
		viewPort.drag().pinch().wheel().decelerate();
		app.stage.addChild(viewPort);
		viewPort.on('zoomed', (e: any) => {
			if (viewPort.scale.x < 0.7) {
				viewPort.setZoom(0.7, viewPort.center);
				return;
			} else if (viewPort.scale.x > 1.5) {
				viewPort.setZoom(1.5, viewPort.center);
				return;
			}
		});
		return new RenderingLayers(app.stage, viewPort);
	}
}
