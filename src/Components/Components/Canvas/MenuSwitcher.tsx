import { Component, h } from 'preact';
import TankMenuComponent from './TankMenuComponent';
import MultiTankMenuComponent from './MultiTankMenuComponent';
import CellMenuComponent from './CellMenuComponent';
import MultiMenuComponent from './MultiMenuComponent';
import TruckMenuComponent from './TruckMenuComponent';
import ReactorMenuComponent from './ReactorMenuComponent';
import HqMenuComponent from './HqMenuComponent';
import { CellGroup } from '../../../Core/Items/CellGroup';
import { Item } from '../../../Core/Items/Item';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../../Core/Items/Cell/Field/Hq/Headquarter';
import { Tank } from '../../../Core/Items/Unit/Tank';
import { Truck } from '../../../Core/Items/Unit/Truck';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import { FieldProp } from './FieldProp';

export default class MenuSwitcher extends Component<
	{
		OnClick: (e: Item) => void;
		TankRequestCount: number;
		TruckRequestCount: number;
		VehicleCount: number;
		ReactorCount: number;
		HasMultiMenu: boolean;
		Fields: FieldProp[];
		Item: Item;
	},
	{}
> {
	render() {
		if (this.props.HasMultiMenu) {
			return <MultiMenuComponent Item={this.props.Item} />;
		} else if (this.props.Item) {
			if (this.props.Item instanceof Tank) {
				return <TankMenuComponent callback={this.props.OnClick} Tank={this.props.Item} />;
			} else if (this.props.Item instanceof Truck) {
				return <TruckMenuComponent callBack={this.props.OnClick} Truck={this.props.Item} />;
			} else if (this.props.Item instanceof UnitGroup) {
				return <MultiTankMenuComponent callback={this.props.OnClick} item={this.props.Item} />;
			} else if (this.props.Item instanceof Headquarter) {
				return (
					<HqMenuComponent
						callback={this.props.OnClick}
						TankRequestCount={this.props.TankRequestCount}
						TruckRequestCount={this.props.TruckRequestCount}
						VehicleCount={this.props.VehicleCount}
					/>
				);
			} else if (this.props.Item instanceof ReactorField) {
				return <ReactorMenuComponent Item={this.props.Item} callback={this.props.OnClick} />;
			} else if (this.props.Item instanceof Cell || this.props.Item instanceof CellGroup) {
				return <CellMenuComponent Fields={this.props.Fields} OnClick={this.props.OnClick} />;
			}
		}
		return '';
	}
}
