import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
export class YMapBuilder implements IPlaygroundBuilder {
	GetAllCoos(ranges: number): HexAxial[] {
		throw new Error('Method not implemented.');
	}
	GetRefCoo(ranges: number): HexAxial {
		throw new Error('Method not implemented.');
	}
	GetAreaCoos(ranges: number): HexAxial[] {
		throw new Error('Method not implemented.');
	}
}
