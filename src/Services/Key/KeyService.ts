import { FireBuilder } from '../Builder/FireBuilder';
import { CamBuilder } from '../Builder/CamBuilder';
import { PlayerBuilder } from '../Builder/PlayerBuilder';
import { GameBuilder } from '../Builder/GameBuilder';
import { SingletonKey } from '../../Singletons';
import { IKeyService } from './IKeyService';
import { DiamBuilder } from '../Builder/DiamBuilder';
import { ErrorCat, ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';
export class KeyService implements IKeyService {
	private _key: SingletonKey = SingletonKey.None;
	GetAppKey(): SingletonKey {
		if (this._key === SingletonKey.None) {
			ErrorHandler.Throw(ErrorCat.invalidParameter);
		}
		return this._key;
	}
	DefineKey(appService: any): void {
		ErrorHandler.ThrowNull(appService);
		if (appService instanceof GameBuilder) {
			this._key = SingletonKey.GameBuilder;
		} else if (appService instanceof PlayerBuilder) {
			this._key = SingletonKey.PlayerBuilder;
		} else if (appService instanceof CamBuilder) {
			this._key = SingletonKey.CamouflageBuilder;
		} else if (appService instanceof FireBuilder) {
			this._key = SingletonKey.FireBuilder;
		} else if (appService instanceof DiamBuilder) {
			this._key = SingletonKey.DiamondBuilder;
		} else {
			ErrorHandler.Throw(ErrorCat.outOfRange);
		}
	}

	Collect(): void {
		this._key = SingletonKey.None;
	}
}
