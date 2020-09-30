import { MapContext } from './../../Core/Setup/Generator/MapContext';
import { IAppService } from './IAppService';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class AppService implements IAppService {
	public CreateApp(mapContext: MapContext): boolean {
		console.log('HELLO');
		return false;
	}
}
