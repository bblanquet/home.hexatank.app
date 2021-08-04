import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { IUpdateService } from './IUpdateService';
import { route } from 'preact-router';
import { StaticLogger } from '../../Utils/Logger/StaticLogger';
import { LogKind } from '../../Utils/Logger/LogKind';
import { GameState } from '../../Core/Framework/World/GameState';
import { ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';

export class UpdateService implements IUpdateService {
	private _itemsUpdater: ItemsUpdater;

	Register(state: GameState): void {
		this._itemsUpdater = new ItemsUpdater(state);
		this._itemsUpdater.OnError.On((src: any, data: Error) => {
			ErrorHandler.Log(data);
			ErrorHandler.Send(data);
			Gameworld.Error = data;
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
