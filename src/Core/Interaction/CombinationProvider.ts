import { MultiUnitOneCellOrderCombination } from './Combination/Multi/MultiUnitOneCellOrderCombination';
import { IHqGameworld } from '../Framework/World/IHqGameworld';
import { ActiveMultiSelectionCombination } from './Combination/Multi/ActiveMultiSelectionCombination';
import { ClearActiveMultiSelectionCombnation } from './Combination/Multi/ClearActiveMultiSelectionCombnation';
import { OverlockCombination } from './Combination/OverlockCombination';
import { SwithcMultiCombination } from './Combination/SwitchMultiCombination';
import { BatteryField } from '../Items/Cell/Field/Bonus/BatteryField';
import { NetworkField } from '../Items/Cell/Field/Bonus/NetworkField';
import { NetworkMenuItem } from './../Menu/Buttons/NetworkMenuItem';
import { ThunderMenuItem } from './../Menu/Buttons/ThunderMenuItem';
import { FireField } from '../Items/Cell/Field/Bonus/FireField';
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
import { SwitchToReactorCombination } from './Combination/SwitchToReactorCombination';
import { SwitchToCellCombination } from './Combination/SwitchToCellCombination';
import { SwitchToOccCellCombination } from './Combination/SwitchToOccCellCombination';
import { FarmCombination } from './Combination/FarmCombination';
import { AbortCombination } from './Combination/AbortCombination';
import { SwitchToHeadquarterCombination } from './Combination/SwitchToHeadquarterCombination';
import { PowerUpCombination } from './Combination/PowerUpCombination';
import { PowerDownCombination } from './Combination/PowerDownCombination';
import { PowerCombination } from './Combination/PowerCombination';
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
		gameworld: IHqGameworld
	): ICombination[] {
		return [
			//CLEAR
			new ClearActiveMultiSelectionCombnation(multiSelectionContext),
			new CancelCombination(),
			new ClearMultiCellBonusCombination(),
			new ClearMultiSelectionMenuCombination(),

			//SINGLE SELECTION
			new SwitchToOccCellCombination(gameworld),
			new SwitchToCellCombination(gameworld),
			new SwitchToVehicleCombination(gameworld),
			new SwitchToReactorCombination(gameworld),
			new SwitchToHeadquarterCombination(gameworld),
			new UnselectCombination(checker, gameworld),
			new SelectionCombination(checker, gameworld),

			//MULTI SELECTION
			new MultiUnitOneCellOrderCombination(multiSelectionContext),
			new ActiveMultiSelectionCombination(multiSelectionContext),
			new MultiSelectionCombination(multiSelectionContext),
			new MultiCellSelectionCombination(multiSelectionContext, gameworld),
			new MultiCellBonusCombination(gameworld),
			new MultiUnitSelectionCombination(multiSelectionContext, gameworld),
			new MultiUnitOrderCombination(multiSelectionContext),
			new SwithcMultiCombination(multiSelectionContext),

			//HQ
			new AddTankCombination(gameworld),
			new AddTruckCombination(gameworld),

			//VEHICLE
			new AbortCombination(),
			new TruckDiamondCombination(gameworld),
			new TruckCombination(),
			new CamouflageCombination(),
			new TankCombination(),
			new TargetCombination(),
			new FarmCombination(),

			//CELL
			new ReactorCombination(gameworld),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof SpeedFieldMenuItem,
				(e) => e.SetField(new RoadField(e, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof AttackMenuItem,
				(e) => e.SetField(new FireField(e, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof SlowMenuItem,
				(e) => e.SetField(new SlowField(e))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof ShieldMenuItem,
				(e) => e.SetField(new ShieldField(e, gameworld.GetPlayerHq().Identity, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof PoisonMenuItem,
				(e) => e.SetField(new PoisonField(e, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof MoneyMenuItem,
				(e) => e.SetField(new FarmField(e, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof ThunderMenuItem,
				(e) => e.SetField(new BatteryField(e, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof NetworkMenuItem,
				(e) => e.SetField(new NetworkField(e, gameworld.GetPlayerHq()))
			),
			new GenericCellCombination(
				gameworld,
				(e) => e instanceof HealMenuItem,
				(e) => e.SetField(new MedicField(e, gameworld.GetPlayerHq()))
			),

			//REACTOR
			new PowerDownCombination(),
			new PowerCombination(),
			new OverlockCombination(),
			new PowerUpCombination(gameworld),

			//CLEAR
			new ClearTrashCombination(checker)
		];
	}
}
