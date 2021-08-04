import * as PIXI from 'pixi.js';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { IAppService } from './IAppService';
export class AppService implements IAppService {
	private _app: PIXI.Application;
	Publish(): PIXI.Application {
		return this._app;
	}
	Collect(): void {
		this._app.destroy();
	}
	public Register(mapkind: MapKind): void {
		this._app = new PIXI.Application({});
		this._app.renderer.backgroundColor = this.GetColor(mapkind);
	}

	private GetColor(mapkind: MapKind): number {
		let color = 0x00a651;
		if (mapkind === MapKind.Sand) {
			color = 0xfece63;
		} else if (mapkind === MapKind.Ice) {
			color = 0xacddf3;
		}
		return color;
	}
}
