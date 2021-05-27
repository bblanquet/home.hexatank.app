import { CamouflageBluePrint } from './../../Core/Setup/Blueprint/Camouflage/CamouflageBluePrint';
import { CamouflageRenderer } from './../../Core/Setup/Render/CamouflageRenderer/CamouflageRenderer';
import { CamouflageGameContext } from './../../Core/Framework/CamouflageGameContext';
import { IGameContextService } from './IGameContextService';

export class CamouflageGameContextService implements IGameContextService<CamouflageBluePrint, CamouflageGameContext> {
	private _gameContext: CamouflageGameContext;

	Register(mapContext: CamouflageBluePrint): void {
		this._gameContext = new CamouflageRenderer().Render(mapContext);
	}
	Publish(): CamouflageGameContext {
		return this._gameContext;
	}

	Collect(): void {
		this._gameContext = null;
	}
}
