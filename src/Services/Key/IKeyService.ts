import { IGarbage } from './../IGarbage';
import { FactoryKey } from './../../Factory';
export interface IKeyService extends IGarbage {
	GetAppKey(): FactoryKey;
	DefineKey(appService: any): void;
}
