import { MapContext } from '../Setup/Generator/MapContext';
import * as PIXI from 'pixi.js';
import { MapEnv } from '../Setup/Generator/MapEnv';

export class AppProvider {
	public Provide(mapContext: MapContext): PIXI.Application {
		const app = new PIXI.Application({});
		app.renderer.backgroundColor = this.GetColor(mapContext);
		return app;
	}

	private GetColor(mapContext: MapContext): number {
		let color = 0x00a651;
		if (mapContext.MapMode === MapEnv.sand) {
			color = 0xfece63;
		} else if (mapContext.MapMode === MapEnv.ice) {
			color = 0xacddf3;
		}
		return color;
	}
}
