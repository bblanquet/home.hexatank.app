import { OverlockCombination } from './Combination/OverlockCombination';
import { SwithcMultiCombination } from './Combination/SwitchMultiCombination';
import { BatteryField } from '../Items/Cell/Field/Bonus/BatteryField';
import { NetworkField } from '../Items/Cell/Field/Bonus/NetworkField';
import { NetworkMenuItem } from './../Menu/Buttons/NetworkMenuItem';
import { ThunderMenuItem } from './../Menu/Buttons/ThunderMenuItem';
import { AttackField } from '../Items/Cell/Field/Bonus/AttackField';
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
import { SelectionCombination } from './Combination/SelectionCombination';
import { CancelCombination } from './Combination/CancelCombination';
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
import { ReactorCombination } from './Combination/ReactorCombination';
import { CamouflageCombination } from './Combination/CamouflageCombination';
import { MultiSelectionContext } from '../Menu/Smart/MultiSelectionContext';
import { AttackMenuItem } from '../Menu/Buttons/AttackMenuItem';
import { SlowMenuItem } from '../Menu/Buttons/SlowMenuItem';
import { SlowField } from '../Items/Cell/Field/Bonus/SlowField';
import { ShieldMenuItem } from '../Menu/Buttons/ShieldMenuItem';
import { ShieldField } from '../Items/Cell/Field/Bonus/ShieldField';
import { PoisonMenuItem } from '../Menu/Buttons/PoisonMenuItem';
import { PoisonField } from '../Items/Cell/Field/Bonus/PoisonField';
import { MoneyMenuItem } from '../Menu/Buttons/MoneyMenuItem';
import { FarmField } from '../Items/Cell/Field/Bonus/FarmField';
import { HealMenuItem } from '../Menu/Buttons/HealMenuItem';
import { MedicField } from '../Items/Cell/Field/Bonus/MedicField';
import { SpeedFieldMenuItem } from '../Menu/Buttons/SpeedFieldMenuItem';
import { RoadField } from '../Items/Cell/Field/Bonus/RoadField';

export class CombinationProvider {
	GetCombination(appHandler: AppHandler, checker: ISelectableChecker, gameContext: GameContext): ICombination[] {
		const multiselectionMenu = new MultiSelectionMenu();
		const multiSelectionContext = new MultiSelectionContext(appHandler.GetViewport());
		return [
			new AbortCombination(),
			new CancelCombination(),
			new CamouflageCombination(),
			new SwithcMultiCombination(appHandler, multiSelectionContext),

			new DisplayMultiMenuCombination(multiselectionMenu, appHandler),
			new MovingMultiMenuCombination(multiselectionMenu),
			new UpMultiMenuCombination(multiselectionMenu, appHandler),
			new MultiSelectionCombination(multiSelectionContext),
			new MultiUnitSelectionCombination(multiselectionMenu, multiSelectionContext, appHandler, gameContext),
			new MultiCellSelectionCombination(multiselectionMenu, multiSelectionContext, appHandler, gameContext),

			new FlagCellCombination(gameContext),
			new SearchMoneyCombination(),
			new AddTankCombination(gameContext),
			new AddTruckCombination(gameContext),
			new SwitchToCellCombination(),
			new SwitchToVehicleCombination(gameContext),
			new SwitchToInfluenceCombination(),
			new SwitchToHeadquarterCombination(),
			new TruckDiamondCombination(),
			new TruckCombination(),
			new TankCombination(),
			new PatrolCombination(),
			new ClearTrashCombination(checker),
			new UnselectCombination(checker, gameContext),
			new SelectionCombination(checker, gameContext),
			new TargetCombination(),
			new ReactorCombination(gameContext),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof SpeedFieldMenuItem,
				(e) => new RoadField(e, gameContext.GetMainHq()),
				'Fast'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof AttackMenuItem,
				(e) => new AttackField(e, gameContext.GetMainHq()),
				'Attack'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof SlowMenuItem,
				(e) => new SlowField(e, gameContext.GetMainHq().GetSkin().GetLight()),
				'Slow'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof ShieldMenuItem,
				(e) => new ShieldField(e, gameContext.GetMainHq()),
				'Shield'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof PoisonMenuItem,
				(e) => new PoisonField(e, gameContext.GetMainHq()),
				'Poison'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof MoneyMenuItem,
				(e) => new FarmField(e, gameContext.GetMainHq()),
				'Money'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof ThunderMenuItem,
				(e) => new BatteryField(e, gameContext.GetMainHq()),
				'Thunder'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof NetworkMenuItem,
				(e) => new NetworkField(e, gameContext.GetMainHq()),
				'Network'
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof HealMenuItem,
				(e) => new MedicField(e, gameContext.GetMainHq()),
				'Heal'
			),
			new PowerDownCombination(),
			new OverlockCombination(),
			new PowerUpCombination(gameContext)
		];
	}
}
