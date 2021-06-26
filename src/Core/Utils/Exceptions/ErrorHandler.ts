import { Env } from '../../../Env';
import { LogKind } from '../Logger/LogKind';
import { StaticLogger } from '../Logger/StaticLogger';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IAnalyzeService } from '../../../Services/Analyse/IAnalyzeService';
import { Dictionary } from '../Collections/Dictionary';

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
		if (!Env.IsPrd()) {
			this.Log(error);
		} else {
			Singletons.Load<IAnalyzeService>(SingletonKey.Analyze).Analyze('exception', error);
		}
	}

	public static ThrowNull(obj: any): void {
		if (obj === undefined || obj === null) {
			const error = new Error('null exception');
			if (!Env.IsPrd()) {
				this.Log(error);
			} else {
				Singletons.Load<IAnalyzeService>(SingletonKey.Analyze).Analyze('exception', error);
			}
		}
	}

	public static ThrowNullOrEmpty(obj: any[]): void {
		if (obj === undefined || obj === null || obj.length === 0) {
			const error = new Error('null/empty exception');
			if (!Env.IsPrd()) {
				this.Log(error);
			} else {
				Singletons.Load<IAnalyzeService>(SingletonKey.Analyze).Analyze('exception', error);
			}
		}
	}

	private static Log(error: Error) {
		StaticLogger.Log(LogKind.error, `${error.message}\n${error.name}\n${error.stack}`);
		throw error;
	}
}
