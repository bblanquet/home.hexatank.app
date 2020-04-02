import { GameContext } from './../Framework/GameContext';
import { ISelectableChecker } from './ISelectableChecker';
import { ISelectable } from './../ISelectable';
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
import { MovingInteractionContext } from '../Menu/Smart/MovingInteractionContext';

export class CombinationProvider {
	GetCombination(appHandler: AppHandler, checker: ISelectableChecker, gameContext: GameContext): ICombination[] {
		const multiselectionMenu = new MultiSelectionMenu();
		const multiSelectionContext = new MovingInteractionContext(appHandler.GetViewport());
		return [
			new DisplayMultiMenuCombination(multiselectionMenu, appHandler),
			new MovingMultiMenuCombination(multiselectionMenu),
			new UpMultiMenuCombination(multiselectionMenu, appHandler),
			new MultiSelectionCombination(multiSelectionContext),
			new MultiUnitSelectionCombination(multiselectionMenu, multiSelectionContext, appHandler),
			new MultiCellSelectionCombination(multiselectionMenu, multiSelectionContext, appHandler, gameContext),
			new FlagCellCombination(),
			new AbortCombination(),
			new SearchMoneyCombination(),
			new InfluenceCombination(),
			new AddTankCombination(),
			new AddTruckCombination(),
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
			new FastCellCombination(),
			new CamouflageCombination(),
			new TargetCombination(),
			new AttackCellCombination(),
			new SlowCellCombination(),
			new PoisonCellCombination(),
			new MoneyCellCombination(),
			new HealCellCombination(),
			new RangeUpCombination(),
			new RangeDownCombination(),
			new PowerDownCombination(),
			new PowerUpCombination()
		];
	}
}
