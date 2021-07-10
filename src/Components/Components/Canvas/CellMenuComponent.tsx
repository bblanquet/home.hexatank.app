import { Component, h } from 'preact';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { Item } from '../../../Core/Items/Item';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { ReactorMenuItem } from '../../../Core/Menu/Buttons/ReactorMenuItem';
import { MoneyMenuItem } from '../../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../../Core/Menu/Buttons/PoisonMenuItem';
import { ShieldMenuItem } from '../../../Core/Menu/Buttons/ShieldMenuItem';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { ThunderMenuItem } from '../../../Core/Menu/Buttons/ThunderMenuItem';
import CircularV2Component from '../../Common/CircularV2/CircularV2';
import LightDarkBtn from '../../Common/Button/Standard/LightDarkBtn';
import { Point } from '../../../Utils/Geometry/Point';
import Switch from '../../Common/Struct/Switch';

export default class CellMenuComponent extends Component<
	{
		Item: Item;
		ReactorCount: number;
		isCovered: boolean;
		callback: (e: Item) => void;
	},
	{}
> {
	render() {
		return (
			<div class="circle-menu">
				<Switch
					isVisible={!this.props.isCovered}
					left={
						<CircularV2Component OnCancel={() => this.props.callback(new CancelMenuItem())}>
							<LightDarkBtn
								CallBack={() => this.props.callback(new ReactorMenuItem())}
								Amount={`${(this.props.ReactorCount + 1) * GameSettings.FieldPrice}`}
								Icon="fill-reactor"
								Point={new Point(0, 0)}
							/>
						</CircularV2Component>
					}
					right={
						<CircularV2Component OnCancel={() => this.props.callback(new CancelMenuItem())}>
							<LightDarkBtn
								CallBack={() => this.props.callback(new ReactorMenuItem())}
								Amount={`${(this.props.ReactorCount + 1) * GameSettings.FieldPrice}`}
								Icon="fill-reactor"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new ThunderMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-thunder"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new ShieldMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-shield"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new MoneyMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-money"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new AttackMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-power"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new PoisonMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-poison"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new SpeedFieldMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-speed"
								Point={new Point(0, 0)}
							/>
							<LightDarkBtn
								CallBack={() => this.props.callback(new HealMenuItem())}
								Amount={`${GameSettings.FieldPrice}`}
								Icon="fill-medic"
								Point={new Point(0, 0)}
							/>
						</CircularV2Component>
					}
				/>
			</div>
		);
	}
}
