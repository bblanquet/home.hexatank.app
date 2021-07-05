import { Component, h } from 'preact';
import TankMenuComponent from './TankMenuComponent';
import MultiTankMenuComponent from './MultiTankMenuComponent';
import CellMenuComponent from './CellMenuComponent';
import MultiMenuComponent from './MultiMenuComponent';
import TruckMenuComponent from './TruckMenuComponent';
import ReactorMenuComponent from './ReactorMenuComponent';
import HqMenuComponent from './HqMenuComponent';
import { GameContext } from '../../../Core/Framework/Context/GameContext';
import { CellGroup } from '../../../Core/Items/CellGroup';
import { Item } from '../../../Core/Items/Item';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../../Singletons';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../../Core/Items/Cell/Field/Hq/Headquarter';
import { Tank } from '../../../Core/Items/Unit/Tank';
import { Truck } from '../../../Core/Items/Unit/Truck';
import { UnitGroup } from '../../../Core/Items/UnitGroup';

export default class MenuSwitcher extends Component<
	{
		IsSettingPatrol: boolean;
		TankRequestCount: number;
		TruckRequestCount: number;
		VehicleCount: number;
		ReactorCount: number;
		HasMultiMenu: boolean;
		IsCovered: boolean;
		Item: Item;
	},
	{}
> {
	private _interactionService: IInteractionService<GameContext>;

	constructor() {
		super();
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
	}

	render() {
		if (this.props.HasMultiMenu) {
			return <MultiMenuComponent Item={this.props.Item} />;
		} else if (this.props.Item) {
			if (this.props.Item instanceof Tank) {
				return (
					<TankMenuComponent
						Interaction={this._interactionService.Publish()}
						Tank={this.props.Item}
						isSettingPatrol={this.props.IsSettingPatrol}
					/>
				);
			} else if (this.props.Item instanceof Truck) {
				return (
					<TruckMenuComponent
						Interaction={this._interactionService.Publish()}
						Truck={this.props.Item}
						isSettingPatrol={this.props.IsSettingPatrol}
					/>
				);
			} else if (this.props.Item instanceof UnitGroup) {
				return (
					<MultiTankMenuComponent Interaction={this._interactionService.Publish()} item={this.props.Item} />
				);
			} else if (this.props.Item instanceof Headquarter) {
				return (
					<HqMenuComponent
						Interaction={this._interactionService.Publish()}
						TankRequestCount={this.props.TankRequestCount}
						TruckRequestCount={this.props.TruckRequestCount}
						VehicleCount={this.props.VehicleCount}
					/>
				);
			} else if (this.props.Item instanceof ReactorField) {
				return <ReactorMenuComponent Item={this.props.Item} Interaction={this._interactionService.Publish()} />;
			} else if (this.props.Item instanceof Cell || this.props.Item instanceof CellGroup) {
				return (
					<CellMenuComponent
						Item={this.props.Item}
						isCovered={this.props.IsCovered}
						Interaction={this._interactionService.Publish()}
						ReactorCount={this.props.ReactorCount}
					/>
				);
			}
		}
		return '';
	}
}
