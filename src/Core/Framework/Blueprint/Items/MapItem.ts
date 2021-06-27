import { LightHexAxial } from '../../../Utils/Geometry/HexAxial';
import { DecorationType } from './DecorationType';

export class MapItem {
	public Type: DecorationType;
	public Position: LightHexAxial;

	public static New(q: number, r: number): MapItem {
		const m = new MapItem();
		m.Position = new LightHexAxial();
		m.Type = DecorationType.None;
		m.Position.R = r;
		m.Position.Q = q;
		return m;
	}
}
