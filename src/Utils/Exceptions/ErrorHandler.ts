import { LogKind } from '../Logger/LogKind';
import { StaticLogger } from '../Logger/StaticLogger';
import { Singletons, SingletonKey } from '../../Singletons';
import { IAnalyzeService } from '../../Services/Analyse/IAnalyzeService';
import { Dictionary } from '../Collections/Dictionary';
import { ErrorSender } from './ErrorSender';

export enum ErrorCat {
	outOfRange,
	null,
	nullEmpty,
	invalidParameter,
	invalidType,
	unsupportedVariable,
	invalidComputation,
	methodNotImplemented
}

export class ErrorHandler {
	private static _lastErrorDate: number = null;
	private static _fiveSeconds = 5000;
	private static _errorSender: ErrorSender = new ErrorSender();

	private static IsNewError(): boolean {
		const now = Date.now();
		const isNew = !this._lastErrorDate || this._fiveSeconds < this._lastErrorDate - now;
		this._lastErrorDate = now;
		return isNew;
	}

	public static Cat: Dictionary<string> = Dictionary.New([
		{ key: ErrorCat[ErrorCat.null], value: 'null object' },
		{ key: ErrorCat[ErrorCat.outOfRange], value: 'out of range' },
		{ key: ErrorCat[ErrorCat.nullEmpty], value: 'null or empty array' },
		{ key: ErrorCat[ErrorCat.invalidParameter], value: 'invalid parameter' },
		{ key: ErrorCat[ErrorCat.invalidType], value: 'invalid type' },
		{ key: ErrorCat[ErrorCat.invalidComputation], value: 'invalid computation' },
		{ key: ErrorCat[ErrorCat.methodNotImplemented], value: 'Method not implemented' }
	]);

	public static Throw(error: Error): void {
		ErrorHandler.Register(error);
		throw error;
	}

	private static Register(error: Error) {
		if (this.IsNewError()) {
			StaticLogger.Log(LogKind.error, `${error.message}\n${error.name}\n${error.stack}`);
			Singletons.Load<IAnalyzeService>(SingletonKey.Analyze).Event('exception', error);
			this._errorSender.Send(error.name, error.stack);
		}
	}

	public static ThrowNull(obj: any): void {
		if (obj === undefined || obj === null) {
			const error = new Error('null exception');
			ErrorHandler.Register(error);
			throw error;
		}
	}

	public static ThrowNullOrEmpty(obj: any[]): void {
		if (obj === undefined || obj === null || obj.length === 0) {
			const error = new Error('null/empty exception');
			ErrorHandler.Register(error);
			throw error;
		}
	}
}
