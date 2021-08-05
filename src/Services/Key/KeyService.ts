import { SingletonKey } from '../../Singletons';
import { IKeyService } from './IKeyService';
import { ErrorCat, ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';
export class KeyService implements IKeyService {
	private _key: SingletonKey = SingletonKey.None;
	GetAppKey(): SingletonKey {
		if (this._key === SingletonKey.None) {
			ErrorHandler.Throw(ErrorCat.invalidParameter);
		}
		return this._key;
	}
	DefineKey(key: SingletonKey): void {
		ErrorHandler.ThrowNullOrUndefined(key);
		this._key = key;
	}

	Collect(): void {
		this._key = SingletonKey.None;
	}
}
