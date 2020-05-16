import { AttackField } from './../Items/Cell/Field/AttackField';
import { GenericCellCombination } from './Combination/GenericCellCombination';
import { GameContext } from './../Framework/GameContext';
import { ISelectableChecker } from './ISelectableChecker';
import { AppHandler } from './../../Components/Canvas/AppHandler';
import { ICombination } from './Combination/ICombination';
import { UnselectCombination } from './Combination/UnselectCombination';
import { ClearTrashCombination } from './Combination/ClearTrashCombination';
import { TruckCombination } from './Combination/TruckCombination';
import { TankCombination } from './Combination/TankCombination';
import { PatrolCombination } from './Combination/PatrolCombination';
import { FastCellCombination } from './Combination/FastcellCombination';
import { AttackCellCombination } from './Combination/AttackcellCombination';
import { HealCellCombination } from './Combination/HealcellCombination';
import { SelectionCombination } from './Combination/SelectionCombination';
import { CancelCombination } from './Combination/CancelCombination';
import { MoneyCellCombination } from './Combination/MoneycellCombination';
import { TargetCombination } from './Combination/TargetCombination';
import { SwitchToVehicleCombination } from './Combination/SwitchToVehicleCombination';
import { AddTruckCombination } from './Combination/AddTruckCombination';
import { AddTankCombination } from './Combination/AddTankCombination';
import { FlagCellCombination } from './Combination/FlagCellCombination';
import { TruckDiamondCombination } from './Combination/TruckDiamondCombination';
import { MultiCellSelectionCombination } from './Combination/Multi/MultiCellSelectionCombination';
import { MultiUnitSelectionCombination } from './Combination/Multi/MultiUnitSelectionCombination';
import { MultiSelectionCombination } from './Combination/Multi/MultiSelectionCombination';
import { UpMultiMenuCombination } from './Combination/Multi/UpMultiMenuCombination';
import { MovingMultiMenuCombination } from './Combination/Multi/MovingMultiMenuCombination';
import { MultiSelectionMenu } from '../Menu/Smart/MultiSelectionMenu';
import { DisplayMultiMenuCombination } from './Combination/Multi/DisplayMultiMenuCombination';
import { SwitchToInfluenceCombination } from './Combination/SwitchToInfluenceCombination';
import { SwitchToCellCombination } from './Combination/SwitchToCellCombination';
import { SearchMoneyCombination } from './Combination/SearchMoneyCombination';
import { AbortCombination } from './Combination/AbortCombination';
import { SwitchToHeadquarterCombination } from './Combination/SwitchToHeadquarterCombination';
import { PowerUpCombination } from './Combination/PowerUpCombination';
import { PowerDownCombination } from './Combination/PowerDownCombination';
import { RangeDownCombination } from './Combination/RangeDownCombination';
import { RangeUpCombination } from './Combination/RangeUpCombination';
import { InfluenceCombination } from './Combination/InfluenceCombination';
import { CamouflageCombination } from './Combination/CamouflageCombination';
import { PoisonCellCombination } from './Combination/PoisonCellCombination';
import { SlowCellCombination } from './Combination/SlowCellCombination';
import { ShieldCellCombination } from './Combination/ShieldCellCombination';
import { MovingInteractionContext } from '../Menu/Smart/MovingInteractionContext';
import { AttackMenuItem } from '../Menu/Buttons/AttackMenuItem';
import { SlowMenuItem } from '../Menu/Buttons/SlowMenuItem';
import { SlowField } from '../Items/Cell/Field/SlowField';

export class CombinationProvider {
	GetCombination(appHandler: AppHandler, checker: ISelectableChecker, gameContext: GameContext): ICombination[] {
		const multiselectionMenu = new MultiSelectionMenu();
		const multiSelectionContext = new MovingInteractionContext(appHandler.GetViewport());
		return [
			new DisplayMultiMenuCombination(multiselectionMenu, appHandler),
			new MovingMultiMenuCombination(multiselectionMenu),
			new UpMultiMenuCombination(multiselectionMenu, appHandler),
			new MultiSelectionCombination(multiSelectionContext),
			new MultiUnitSelectionCombination(multiselectionMenu, multiSelectionContext, appHandler, gameContext),
			new MultiCellSelectionCombination(multiselectionMenu, multiSelectionContext, appHandler, gameContext),
			new FlagCellCombination(gameContext),
			new AbortCombination(),
			new SearchMoneyCombination(),
			new InfluenceCombination(gameContext),
			new AddTankCombination(gameContext),
			new AddTruckCombination(gameContext),
			new SwitchToCellCombination(),
			new SwitchToVehicleCombination(gameContext),
			new SwitchToInfluenceCombination(),
			new SwitchToHeadquarterCombination(),
			new CancelCombination(),
			new TruckDiamondCombination(),
			new TruckCombination(),
			new TankCombination(),
			new PatrolCombination(),
			new ClearTrashCombination(checker),
			new UnselectCombination(checker, gameContext),
			new SelectionCombination(checker, gameContext),
			new FastCellCombination(gameContext),
			new CamouflageCombination(),
			new TargetCombination(),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof AttackMenuItem,
				(e) => new AttackField(e),
				'Attack'
			),
			new GenericCellCombination(gameContext, (e) => e instanceof SlowMenuItem, (e) => new SlowField(e), 'Slow'),
			new SlowCellCombination(gameContext),
			new ShieldCellCombination(gameContext),
			new PoisonCellCombination(gameContext),
			new MoneyCellCombination(gameContext),
			new HealCellCombination(gameContext),
			new RangeUpCombination(gameContext),
			new RangeDownCombination(),
			new PowerDownCombination(),
			new PowerUpCombination(gameContext)
		];
	}
}
