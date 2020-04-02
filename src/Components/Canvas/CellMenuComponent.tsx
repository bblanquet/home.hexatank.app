import { Component, h } from 'preact';
import { Item } from '../../Core/Items/Item';
import { InfluenceMenuItem } from '../../Core/Menu/Buttons/InfluenceMenuItem';
import { AttackMenuItem } from '../../Core/Menu/Buttons/AttackMenuItem';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { SpeedFieldMenuItem } from '../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../Core/Menu/Buttons/PoisonMenuItem';
import { SlowMenuItem } from '../../Core/Menu/Buttons/SlowMenuItem';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { AppHandler } from './AppHandler';
import { GameContext } from '../../Core/Framework/GameContext';

export default class CellMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{}
> {
	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new InfluenceMenuItem())}
						>
							<div class="fill-influence max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.TruckPrice * this.props.GameContext.MainHq.GetInfluenceCount()}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new AttackMenuItem())}
						>
							<div class="fill-power max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.FieldPrice}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new SpeedFieldMenuItem())}
						>
							<div class="fill-speed max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.FieldPrice}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new HealMenuItem())}
						>
							<div class="fill-medic max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.FieldPrice}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new MoneyMenuItem())}
						>
							<div class="fill-money max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.FieldPrice}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new PoisonMenuItem())}
						>
							<div class="fill-poison max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.FieldPrice}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new SlowMenuItem())}
						>
							<div class="fill-slow max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.FieldPrice}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new CancelMenuItem())}
						>
							<div class="fill-cancel max-width standard-space" />
						</button>
					</div>
				</div>
			</div>
		);
	}

	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}
}
