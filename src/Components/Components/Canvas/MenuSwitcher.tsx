import { Component, h } from 'preact';
import LeftMenu from './LeftMenu';
import CellMenuComponent from './CellMenuComponent';
import MultiMenuComponent from './MultiMenuComponent';
import ReactorMenuComponent from './ReactorMenuComponent';
import HqMenuComponent from './HqMenuComponent';
import { CellGroup } from '../../../Core/Items/CellGroup';
import { Item } from '../../../Core/Items/Item';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../../Core/Items/Cell/Field/Hq/Headquarter';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import { FieldProp } from './FieldProp';
import { ButtonProp } from './ButtonProp';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import MenuBtn from './MenuBtn';

export default class MenuSwitcher extends Component<
	{
		OnClick: (e: Item) => void;
		TankRequestCount: number;
		TruckRequestCount: number;
		VehicleCount: number;
		ReactorCount: number;
		HasMultiMenu: boolean;
		FieldBtns: FieldProp[];
		Btns: ButtonProp[];
		Item: Item;
	},
	{}
> {
	render() {
		if (this.props.HasMultiMenu) {
			return <MultiMenuComponent Item={this.props.Item} />;
		} else if (this.props.Item) {
			if (this.props.Item instanceof Vehicle || this.props.Item instanceof UnitGroup) {
				return <LeftMenu Btns={this.props.Btns} />;
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
				return <ReactorMenuComponent Item={this.props.Item} Btns={this.props.Btns} />;
			} else if (this.props.Item instanceof Cell || this.props.Item instanceof CellGroup) {
				return <CellMenuComponent Fields={this.props.FieldBtns} OnClick={this.props.OnClick} />;
			}
		}
		return '';
	}
}
