import { Component, h } from 'preact';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { InteractionContext } from '../../../Core/Interaction/InteractionContext';
import { Item } from '../../../Core/Items/Item';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { InfluenceMenuItem } from '../../../Core/Menu/Buttons/InfluenceMenuItem';
import { MoneyMenuItem } from '../../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../../Core/Menu/Buttons/PoisonMenuItem';
import { ShieldMenuItem } from '../../../Core/Menu/Buttons/ShieldMenuItem';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { ThunderMenuItem } from '../../../Core/Menu/Buttons/ThunderMenuItem';
import CircularV2Component from '../../Common/CircularV2/CircularV2';
import LightDarkBtn from '../../Common/Button/Standard/LightDarkBtn';
import { Point } from '../../../Core/Utils/Geometry/Point';

export default class CellMenuComponent extends Component<
	{ Item: Item; ReactorCount: number; Interaction: InteractionContext },
	{}
> {
	constructor() {
		super();
	}
	render() {
		return (
			<div class="circle-menu">
				<CircularV2Component OnCancel={() => this.Cancel()}>
					<LightDarkBtn
						CallBack={() => this.SendContext(new InfluenceMenuItem())}
						Amount={`${(this.props.ReactorCount + 1) * GameSettings.FieldPrice}`}
						Icon="fill-influence"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new ThunderMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-thunder"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new ShieldMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-shield"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new MoneyMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-money"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new AttackMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-power"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new PoisonMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-poison"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new SpeedFieldMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-speed"
						Point={new Point(0, 0)}
					/>
					<LightDarkBtn
						CallBack={() => this.SendContext(new HealMenuItem())}
						Amount={`${GameSettings.FieldPrice}`}
						Icon="fill-medic"
						Point={new Point(0, 0)}
					/>
				</CircularV2Component>
			</div>
		);
	}

	private SendContext(item: Item): void {
		this.props.Interaction.Kind = InteractionKind.Up;
		this.props.Interaction.OnSelect(item);
	}

	private Cancel(): void {
		this.SendContext(new CancelMenuItem());
	}
}
