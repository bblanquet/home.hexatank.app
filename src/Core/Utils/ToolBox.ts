import { resolveTripleslashReference } from 'typescript';

export function isNullOrUndefined(obj: any): boolean {
	return typeof obj === 'undefined' || obj === null;
}
