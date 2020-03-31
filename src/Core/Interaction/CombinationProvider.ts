import { AppHandler } from './../../Components/Canvas/AppHandler';
import { IContextContainer } from './IContextContainer';
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
import { Item } from '../Items/Item';
import { IInteractionContext } from './IInteractionContext';

export class CombinationProvider {
	GetCombination(
		container: IContextContainer,
		context: IInteractionContext,
		appHanlder: AppHandler,
		isSelectable: (item: Item) => boolean
	): ICombination[] {
		const multiselectionMenu = new MultiSelectionMenu();
		const multiSelectionContext = new MovingInteractionContext();
		let combinations = new Array<ICombination>();

		combinations.push(new DisplayMultiMenuCombination(context, multiselectionMenu, appHanlder));
		combinations.push(new MovingMultiMenuCombination(multiselectionMenu));
		combinations.push(new UpMultiMenuCombination(multiselectionMenu, context, appHanlder));
		combinations.push(new MultiSelectionCombination(multiSelectionContext));
		combinations.push(
			new MultiUnitSelectionCombination(multiselectionMenu, multiSelectionContext, context, appHanlder)
		);
		combinations.push(
			new MultiCellSelectionCombination(multiselectionMenu, multiSelectionContext, context, appHanlder)
		);
		combinations.push(new FlagCellCombination());
		combinations.push(new AbortCombination());
		combinations.push(new SearchMoneyCombination());
		combinations.push(new InfluenceCombination());
		combinations.push(new AddTankCombination());
		combinations.push(new AddTruckCombination());
		combinations.push(new SwitchToCellCombination());
		combinations.push(new SwitchToVehicleCombination());
		combinations.push(new SwitchToInfluenceCombination());
		combinations.push(new SwitchToHeadquarterCombination());
		combinations.push(new CancelCombination(container));
		combinations.push(new TruckDiamondCombination(container));
		combinations.push(new TruckCombination());
		combinations.push(new TankCombination());
		combinations.push(new PatrolCombination());
		combinations.push(new ClearTrashCombination(isSelectable, container));
		combinations.push(new UnselectCombination(isSelectable, container));
		combinations.push(new SelectionCombination(isSelectable));
		combinations.push(new FastCellCombination());
		combinations.push(new CamouflageCombination());
		combinations.push(new TargetCombination(container));
		combinations.push(new AttackCellCombination());
		combinations.push(new SlowCellCombination());
		combinations.push(new PoisonCellCombination());
		combinations.push(new MoneyCellCombination());
		combinations.push(new HealCellCombination());
		combinations.push(new RangeUpCombination());
		combinations.push(new RangeDownCombination());
		combinations.push(new PowerDownCombination());
		combinations.push(new PowerUpCombination());
		return combinations;
	}
}
