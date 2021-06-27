import { GameContext } from '../../Core/Framework/Context/GameContext';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { IUpdateService } from './IUpdateService';
import { route } from 'preact-router';
import { StaticLogger } from '../../Core/Utils/Logger/StaticLogger';
import { LogKind } from '../../Core/Utils/Logger/LogKind';

export class UpdateService implements IUpdateService {
	private _itemsUpdater: ItemsUpdater;

	Register(): void {
		this._itemsUpdater = new ItemsUpdater();
		this._itemsUpdater.OnError.On((src: any, data: Error) => {
			GameContext.Error = data;
			route('{{sub_path}}Error', true);
		});
	}

	Publish(): ItemsUpdater {
		return this._itemsUpdater;
	}

	Collect(): void {
		this._itemsUpdater.Items.forEach((item) => {
			try {
				item.Destroy();
				item = null;
			} catch (error) {
				StaticLogger.Log(LogKind.error, error);
			}
		});
		this._itemsUpdater.Items = [];
	}
}
