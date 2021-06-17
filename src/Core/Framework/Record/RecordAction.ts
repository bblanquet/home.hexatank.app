import { RecordKind } from './RecordKind';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
export class RecordAction {
	//X date
	constructor(public X: number, public Amount: HexAxial, public kind: RecordKind, public life: number) {}
}
