import { Component, h } from 'preact';
import LeftMenu from './LeftMenu';
import CellMenuComponent from './CellMenuComponent';
import ReactorMenuComponent from './ReactorMenuComponent';
import { CellGroup } from '../../../Core/Items/CellGroup';
import { Item } from '../../../Core/Items/Item';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../../Core/Items/Cell/Field/Hq/Headquarter';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import { CircleBtnProps } from './CircleBtnProps';
import { BtnProps } from './BtnProps';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';

export default class MenuSwitcher extends Component<
	{
		OnClick: (e: Item) => void;
		VehicleCount: number;
		ReactorCount: number;
		FieldBtns: CircleBtnProps[];
		Btns: BtnProps[];
		Item: Item;
	},
	{}
> {
	render() {
		if (this.props.Item) {
			if (
				this.props.Item instanceof Vehicle ||
				this.props.Item instanceof UnitGroup ||
				this.props.Item instanceof Headquarter
			) {
				return <LeftMenu Btns={this.props.Btns} />;
			} else if (this.props.Item instanceof ReactorField) {
				return <ReactorMenuComponent Item={this.props.Item} Btns={this.props.Btns} />;
			} else if (this.props.Item instanceof Cell || this.props.Item instanceof CellGroup) {
				return <CellMenuComponent Fields={this.props.FieldBtns} OnClick={this.props.OnClick} />;
			}
		}
		return '';
	}
}
