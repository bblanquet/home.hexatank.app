import { resolveTripleslashReference } from 'typescript';

export function isNullOrUndefined(obj: any): boolean {
	return obj !== null || obj !== undefined;
}
