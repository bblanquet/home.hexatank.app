import { CamouflageBlueprint } from '../../Core/Setup/Blueprint/Camouflage/CamouflageBlueprint';
import { CamouflageContext } from '../../Core/Setup/Context/CamouflageContext';
import { CamouflageRenderer } from './../../Core/Setup/Render/CamouflageRenderer/CamouflageRenderer';
import { IGameContextService } from './IGameContextService';

export class CamouflageGameContextService implements IGameContextService<CamouflageBlueprint, CamouflageContext> {
	private _gameContext: CamouflageContext;

	Register(mapContext: CamouflageBlueprint): void {
		this._gameContext = new CamouflageRenderer().Render(mapContext);
	}
	Publish(): CamouflageContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
