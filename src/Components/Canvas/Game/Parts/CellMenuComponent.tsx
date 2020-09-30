import { Component, h } from 'preact';
import { Item } from '../../../../Core/Items/Item';
import { InfluenceMenuItem } from '../../../../Core/Menu/Buttons/InfluenceMenuItem';
import { AttackMenuItem } from '../../../../Core/Menu/Buttons/AttackMenuItem';
import { GameSettings } from '../../../../Core/Framework/GameSettings';
import { SpeedFieldMenuItem } from '../../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../../../Core/Menu/Buttons/MoneyMenuItem';
import { ShieldMenuItem } from '../../../../Core/Menu/Buttons/ShieldMenuItem';
import { InteractionKind } from '../../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../../../../Core/App/AppHandler';
import { GameContext } from '../../../../Core/Framework/GameContext';
import { ThunderMenuItem } from '../../../../Core/Menu/Buttons/ThunderMenuItem';
import { Cell } from '../../../../Core/Items/Cell/Cell';
import { PoisonMenuItem } from '../../../../Core/Menu/Buttons/PoisonMenuItem';
import { CancelMenuItem } from '../../../../Core/Menu/Buttons/CancelMenuItem';
import ExpCircularComponent from '../../../Common/Circular/CircularComponent';
import SmDarkShopBtnComponent from '../../../Common/Button/Standard/SmDarkShopBtnComponent';
import { Point } from '../../../../Core/Utils/Geometry/Point';

export default class CellMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{}
> {
	render() {
		return (
			<ExpCircularComponent OnCancel={() => this.Cancel()} isDark={true}>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new InfluenceMenuItem())}
					Amount={`${this.props.GameContext.GetMainHq().GetReactorsCount() * GameSettings.FieldPrice}`}
					Icon="fill-influence"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new ThunderMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-thunder"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new ShieldMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-shield"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new MoneyMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-money"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new AttackMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-power"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new PoisonMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-poison"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new SpeedFieldMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-speed"
					Point={new Point(0, 0)}
				/>
				<SmDarkShopBtnComponent
					CallBack={() => this.SendContext(new HealMenuItem())}
					Amount={`${GameSettings.FieldPrice}`}
					Icon="fill-medic"
					Point={new Point(0, 0)}
				/>
			</ExpCircularComponent>
		);
	}

	private IsCovered(): boolean {
		if (this.props.Item instanceof Cell) {
			return this.props.GameContext.GetMainHq().IsCovered(this.props.Item as Cell);
		} else {
			return false;
		}
	}

	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}

	private Cancel(): void {
		this.SendContext(new CancelMenuItem());
	}
}

// private DisplayNetwork() {
// 	return (
// 		<button
// 			type="button"
// 			class="btn btn-dark without-padding"
// 			onClick={(e: any) => this.SendContext(new NetworkMenuItem())}
// 		>
// 			<div class="fill-network max-width standard-space" />
// 			<div class="max-width align-text-center darker">
// 				{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span>
// 			</div>
// 		</button>
// 	);
// }
