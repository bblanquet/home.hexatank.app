import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { IRecordContextService } from './IRecordContextService';

export class RecordContextService implements IRecordContextService {
	private _record: RecordContext;

	public Register(blueprint: GameBlueprint, world: Gameworld): void {
		this._record = new RecordContext(blueprint, world);
	}

	public Publish(): RecordContext {
		return this._record;
	}
}
