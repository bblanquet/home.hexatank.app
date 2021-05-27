import { ActiveMultiSelectionCombination } from './Combination/Multi/ActiveMultiSelectionCombination';
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
import { MultiUnitOrderCombination } from './Combination/Multi/MultiUnitOrderCombination';
import { MultiUnitSelectionCombination } from './Combination/Multi/MultiUnitSelectionCombination'; //ClearMultiCellBonusCombination
import { ClearMultiSelectionMenuCombination } from './Combination/Multi/ClearMultiSelectionMenuCombination';
import { ClearMultiCellBonusCombination } from './Combination/Multi/ClearMultiCellBonusCombination';
import { MultiCellBonusCombination } from './Combination/Multi/MultiCellBonusCombination';
import { MultiSelectionCombination } from './Combination/Multi/MultiSelectionCombination';
import { DisplayMultiMenuCombination } from './Combination/Multi/DisplayMultiMenuCombination';
import { SwitchToInfluenceCombination } from './Combination/SwitchToInfluenceCombination';
import { SwitchToCellCombination } from './Combination/SwitchToCellCombination';
import { FarmCombination } from './Combination/FarmCombination';
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
	public Multiselection: MultiSelectionContext;
	GetCombination(
		checker: ISelectableChecker,
		multiSelectionContext: MultiSelectionContext,
		gameContext: GameContext
	): ICombination[] {
		return [
			//CLEAR
			new CancelCombination(),
			new ClearMultiCellBonusCombination(),
			new ClearMultiSelectionMenuCombination(),

			//SINGLE SELECTION
			new SwitchToCellCombination(),
			new SwitchToVehicleCombination(gameContext),
			new SwitchToInfluenceCombination(),
			new SwitchToHeadquarterCombination(),
			new UnselectCombination(checker, gameContext),
			new SelectionCombination(checker, gameContext),

			//MULTI SELECTION
			new DisplayMultiMenuCombination(multiSelectionContext),
			new ActiveMultiSelectionCombination(multiSelectionContext),
			new MultiSelectionCombination(multiSelectionContext),
			new MultiCellSelectionCombination(multiSelectionContext, gameContext),
			new MultiCellBonusCombination(gameContext),
			new MultiUnitSelectionCombination(multiSelectionContext, gameContext),
			new MultiUnitOrderCombination(multiSelectionContext),
			new SwithcMultiCombination(multiSelectionContext),

			//HQ
			new AddTankCombination(gameContext),
			new AddTruckCombination(gameContext),
			new FlagCellCombination(gameContext),

			//VEHICLE
			new AbortCombination(),
			new TruckDiamondCombination(),
			new TruckCombination(),
			new CamouflageCombination(),
			new TankCombination(),
			new PatrolCombination(gameContext),
			new TargetCombination(),
			new FarmCombination(),

			//CELL
			new ReactorCombination(gameContext),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof SpeedFieldMenuItem,
				(e) => new RoadField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof AttackMenuItem,
				(e) => new AttackField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof SlowMenuItem,
				(e) => new SlowField(e, gameContext.GetPlayerHq().GetSkin().GetLight())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof ShieldMenuItem,
				(e) => new ShieldField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof PoisonMenuItem,
				(e) => new PoisonField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof MoneyMenuItem,
				(e) => new FarmField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof ThunderMenuItem,
				(e) => new BatteryField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof NetworkMenuItem,
				(e) => new NetworkField(e, gameContext.GetPlayerHq())
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof HealMenuItem,
				(e) => new MedicField(e, gameContext.GetPlayerHq())
			),

			//REACTOR
			new PowerDownCombination(),
			new OverlockCombination(),
			new PowerUpCombination(gameContext),

			//CLEAR
			new ClearTrashCombination(checker)
		];
	}
}
