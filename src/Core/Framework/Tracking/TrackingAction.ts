import { TrackingKind } from './TrackingKind';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
export class TrackingAction {
	constructor(public X: number, public Amount: HexAxial, public kind: TrackingKind) {}
}
