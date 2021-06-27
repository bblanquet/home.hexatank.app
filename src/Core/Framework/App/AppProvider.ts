import { IBlueprint } from '../../Framework/Blueprint/IBlueprint';
import * as PIXI from 'pixi.js';
import { MapKind } from '../Blueprint/Items/MapKind';

export class AppProvider {
	public Provide(blueprint: IBlueprint): PIXI.Application {
		const app = new PIXI.Application({});
		app.renderer.backgroundColor = this.GetColor(blueprint);
		return app;
	}

	private GetColor(mapContext: IBlueprint): number {
		let color = 0x00a651;
		if (mapContext.MapMode === MapKind.sand) {
			color = 0xfece63;
		} else if (mapContext.MapMode === MapKind.ice) {
			color = 0xacddf3;
		}
		return color;
	}
}
