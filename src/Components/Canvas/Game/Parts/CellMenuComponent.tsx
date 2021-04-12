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
import { GameContext } from '../../../../Core/Framework/GameContext';
import { ThunderMenuItem } from '../../../../Core/Menu/Buttons/ThunderMenuItem';
import { Cell } from '../../../../Core/Items/Cell/Cell';
import { PoisonMenuItem } from '../../../../Core/Menu/Buttons/PoisonMenuItem';
import { CancelMenuItem } from '../../../../Core/Menu/Buttons/CancelMenuItem';
import CircularV2Component from '../../../Common/CircularV2/CircularV2';
import LightDarkBtn from '../../../Common/Button/Standard/LightDarkBtn';
import { Point } from '../../../../Core/Utils/Geometry/Point';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../../Factory';

export default class CellMenuComponent extends Component<{ Item: Item; GameContext: GameContext }, {}> {
	private _interactionService: IInteractionService;
	constructor() {
		super();
		this._interactionService = Factory.Load<IInteractionService>(FactoryKey.Interaction);
	}
	render() {
		return (
			<div class="circle-menu">
				<CircularV2Component OnCancel={() => this.Cancel()}>
					<LightDarkBtn
						CallBack={() => this.SendContext(new InfluenceMenuItem())}
						Amount={`${(this.props.GameContext.GetMainHq().GetReactorsCount() + 1) *
							GameSettings.FieldPrice}`}
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

	private IsCovered(): boolean {
		if (this.props.Item instanceof Cell) {
			return this.props.GameContext.GetMainHq().IsCovered(this.props.Item as Cell);
		} else {
			return false;
		}
	}

	private SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
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
