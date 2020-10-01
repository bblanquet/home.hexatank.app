import { IGarbage } from './../IGarbage';
import { IAppService } from './../App/IAppService';
import { FactoryKey } from './../../Factory';
export interface IKeyService extends IGarbage {
	GetAppKey(): FactoryKey;
	DefineKey(appService: IAppService): void;
}
