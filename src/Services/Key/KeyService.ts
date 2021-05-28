import { PowerAppService } from './../App/PowerAppService';
import { CamouflageAppService } from '../App/CamouflageAppService';
import { RecordAppService } from './../App/RecordAppService';
import { AppService } from './../App/AppService';
import { FactoryKey } from './../../Factory';
import { IKeyService } from './IKeyService';
export class KeyService implements IKeyService {
	private _key: FactoryKey = FactoryKey.None;
	GetAppKey(): FactoryKey {
		if (this._key === FactoryKey.None) {
			throw new Error('Not supposed to ask key when app is not instantiated.');
		}
		return this._key;
	}
	DefineKey(appService: any): void {
		if (appService instanceof AppService) {
			this._key = FactoryKey.App;
		} else if (appService instanceof RecordAppService) {
			this._key = FactoryKey.RecordApp;
		} else if (appService instanceof CamouflageAppService) {
			this._key = FactoryKey.CamouflageApp;
		} else if (appService instanceof PowerAppService) {
			this._key = FactoryKey.PowerApp;
		} else {
			throw new Error('Has to be an app service.');
		}
	}

	Collect(): void {
		this._key = FactoryKey.None;
	}
}
