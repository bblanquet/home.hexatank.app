import { FireAppService } from '../App/FireAppService';
import { CamouflageAppService } from '../App/CamouflageAppService';
import { PlayerAppService } from '../App/PlayerAppService';
import { AppService } from './../App/AppService';
import { SingletonKey } from '../../Singletons';
import { IKeyService } from './IKeyService';
import { DiamondAppService } from '../App/DiamondAppService';
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
		if (appService instanceof AppService) {
			this._key = SingletonKey.App;
		} else if (appService instanceof PlayerAppService) {
			this._key = SingletonKey.RecordApp;
		} else if (appService instanceof CamouflageAppService) {
			this._key = SingletonKey.CamouflageApp;
		} else if (appService instanceof FireAppService) {
			this._key = SingletonKey.FireApp;
		} else if (appService instanceof DiamondAppService) {
			this._key = SingletonKey.DiamondApp;
		} else {
			ErrorHandler.Throw(ErrorCat.outOfRange);
		}
	}

	Collect(): void {
		this._key = SingletonKey.None;
	}
}
