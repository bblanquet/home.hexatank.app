import { MultiUnitOneCellOrderCombination } from './Combination/Multi/MultiUnitOneCellOrderCombination';
import { IHqGameContext } from './../Setup/Context/IHqGameContext';
import { ActiveMultiSelectionCombination } from './Combination/Multi/ActiveMultiSelectionCombination';
import { ClearActiveMultiSelectionCombnation } from './Combination/Multi/ClearActiveMultiSelectionCombnation';
import { OverlockCombination } from './Combination/OverlockCombination';
import { SwithcMultiCombination } from './Combination/SwitchMultiCombination';
import { BatteryField } from '../Items/Cell/Field/Bonus/BatteryField';
import { NetworkField } from '../Items/Cell/Field/Bonus/NetworkField';
import { NetworkMenuItem } from './../Menu/Buttons/NetworkMenuItem';
import { ThunderMenuItem } from './../Menu/Buttons/ThunderMenuItem';
import { AttackField } from '../Items/Cell/Field/Bonus/AttackField';
import { GenericCellCombination } from './Combination/GenericCellCombination';
import { ISelectableChecker } from './ISelectableChecker';
import { ICombination } from './Combination/ICombination';
import { UnselectCombination } from './Combination/UnselectCombination';
import { ClearTrashCombination } from './Combination/ClearTrashCombination';
import { TruckCombination } from './Combination/TruckCombination';
import { TankCombination } from './Combination/TankCombination';
import { SelectionCombination } from './Combination/SelectionCombination';
import { CancelCombination } from './Combination/CancelCombination';
import { TargetCombination } from './Combination/TargetCombination';
import { SwitchToVehicleCombination } from './Combination/SwitchToVehicleCombination';
import { AddTruckCombination } from './Combination/AddTruckCombination';
import { AddTankCombination } from './Combination/AddTankCombination';
import { TruckDiamondCombination } from './Combination/TruckDiamondCombination';
import { MultiCellSelectionCombination } from './Combination/Multi/MultiCellSelectionCombination';
import { MultiUnitOrderCombination } from './Combination/Multi/MultiUnitOrderCombination';
import { MultiUnitSelectionCombination } from './Combination/Multi/MultiUnitSelectionCombination'; //ClearMultiCellBonusCombination
import { ClearMultiSelectionMenuCombination } from './Combination/Multi/ClearMultiSelectionMenuCombination';
import { ClearMultiCellBonusCombination } from './Combination/Multi/ClearMultiCellBonusCombination';
import { MultiCellBonusCombination } from './Combination/Multi/MultiCellBonusCombination';
import { MultiSelectionCombination } from './Combination/Multi/MultiSelectionCombination';
import { DisplayMultiMenuCombination } from './Combination/Multi/DisplayMultiMenuCombination';
import { SwitchToReactorCombination } from './Combination/SwitchToReactorCombination';
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
		gameContext: IHqGameContext
	): ICombination[] {
		return [
			//CLEAR
			new ClearActiveMultiSelectionCombnation(multiSelectionContext),
			new CancelCombination(),
			new ClearMultiCellBonusCombination(),
			new ClearMultiSelectionMenuCombination(),

			//SINGLE SELECTION
			new SwitchToCellCombination(gameContext),
			new SwitchToVehicleCombination(gameContext),
			new SwitchToReactorCombination(gameContext),
			new SwitchToHeadquarterCombination(gameContext),
			new UnselectCombination(checker, gameContext),
			new SelectionCombination(checker, gameContext),

			//MULTI SELECTION
			new MultiUnitOneCellOrderCombination(multiSelectionContext),
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

			//VEHICLE
			new AbortCombination(),
			new TruckDiamondCombination(gameContext),
			new TruckCombination(),
			new CamouflageCombination(),
			new TankCombination(),
			new TargetCombination(),
			new FarmCombination(),

			//CELL
			new ReactorCombination(gameContext),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof SpeedFieldMenuItem,
				(e) => e.SetField(new RoadField(e, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof AttackMenuItem,
				(e) => e.SetField(new AttackField(e, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof SlowMenuItem,
				(e) => e.SetField(new SlowField(e))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof ShieldMenuItem,
				(e) => e.SetField(new ShieldField(e, gameContext.GetPlayerHq().Identity, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof PoisonMenuItem,
				(e) => e.SetField(new PoisonField(e, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof MoneyMenuItem,
				(e) => e.SetField(new FarmField(e, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof ThunderMenuItem,
				(e) => e.SetField(new BatteryField(e, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof NetworkMenuItem,
				(e) => e.SetField(new NetworkField(e, gameContext.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameContext,
				(e) => e instanceof HealMenuItem,
				(e) => e.SetField(new MedicField(e, gameContext.GetPlayerHq()))
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
