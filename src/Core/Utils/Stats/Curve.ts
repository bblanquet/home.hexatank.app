import { ExecFileOptionsWithStringEncoding } from 'child_process';
import { DateValue } from './DateValue';

export class Curve {
	constructor(public Points: DateValue[], public Color: string) {}
}
