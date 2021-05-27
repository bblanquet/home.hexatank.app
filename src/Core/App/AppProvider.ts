import { IBlueprint } from './../Setup/Blueprint/IBlueprint';
import * as PIXI from 'pixi.js';
import { MapEnv } from '../Setup/Blueprint/MapEnv';

export class AppProvider {
	public Provide(mapContext: IBlueprint): PIXI.Application {
		const app = new PIXI.Application({});
		app.renderer.backgroundColor = this.GetColor(mapContext);
		return app;
	}

	private GetColor(mapContext: IBlueprint): number {
		let color = 0x00a651;
		if (mapContext.MapMode === MapEnv.sand) {
			color = 0xfece63;
		} else if (mapContext.MapMode === MapEnv.ice) {
			color = 0xacddf3;
		}
		return color;
	}
}
