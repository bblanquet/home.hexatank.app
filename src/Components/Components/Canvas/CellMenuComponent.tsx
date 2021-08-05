import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import LightDarkBtn from '../../Common/Button/Standard/LightDarkBtn';
import { Point } from '../../../Utils/Geometry/Point';
import { FieldProp } from './FieldProp';
import CircularV2Component from '../../Common/CircularV2/CircularV2';

export default class CellMenuComponent extends Component<
	{
		Fields: FieldProp[];
		OnClick: (e: Item) => void;
	},
	{}
> {
	render() {
		return (
			<div class="circle-menu">
				<CircularV2Component OnCancel={() => this.props.OnClick(new CancelMenuItem())}>
					{this.props.Fields.map((f) => (
						<LightDarkBtn
							OnClick={() => f.OnCLick()}
							Amount={f.Amount.toString()}
							Icon={f.Icon}
							isBlink={f.isBlink}
							Point={new Point(0, 0)}
						/>
					))}
				</CircularV2Component>
			</div>
		);
	}
}
