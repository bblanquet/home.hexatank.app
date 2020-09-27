import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { TrackingField } from './TrackingField';

export class TrackingCell {
	public Coo: HexAxial;
	public Actions: TrackingField[];
}
