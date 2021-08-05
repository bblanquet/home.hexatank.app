import { IGarbage } from './../IGarbage';
import { SingletonKey } from '../../Singletons';
export interface IKeyService extends IGarbage {
	GetAppKey(): SingletonKey;
	DefineKey(key: SingletonKey): void;
}
