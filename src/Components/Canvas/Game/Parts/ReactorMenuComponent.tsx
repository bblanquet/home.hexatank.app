import { Component, h } from 'preact';
import { PlusMenuItem } from '../../../../Core/Menu/Buttons/PlusMenuItem';
import { MinusMenuItem } from '../../../../Core/Menu/Buttons/MinusMenuItem';
import { CancelMenuItem } from '../../../../Core/Menu/Buttons/CancelMenuItem';
import { ReactorField } from '../../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Item } from '../../../../Core/Items/Item';
import { InteractionKind } from '../../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../../../../Core/App/AppHandler';
import { GameContext } from '../../../../Core/Framework/GameContext';
import { AttackMenuItem } from '../../../../Core/Menu/Buttons/AttackMenuItem';
import { SpeedFieldMenuItem } from '../../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../../Core/Menu/Buttons/HealMenuItem';

export default class ReactorMenuComponent extends Component<
	{ Item: ReactorField; AppHandler: AppHandler; GameContext: GameContext },
	{}
> {
	render() {
		const reactor = this.props.Item as ReactorField;
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button type="button" class="btn btn-light without-padding">
							<div class="fill-energy max-width standard-space" />
							<div class="max-width align-text-center darker">
								{reactor.Battery.GetUsedPower()}/{reactor.Battery.GetTotalBatteries()}
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new PlusMenuItem())}
						>
							<div class="fill-plus max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new MinusMenuItem())}
						>
							<div class="fill-minus max-width standard-space" />
						</button>
						{this.RenderAttack()}
						{this.RenderHeal()}
						{this.RenderSpeed()}
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

	private RenderAttack() {
		if (this.props.Item.HasPower()) {
			return (
				<button
					type="button"
					class="btn btn-dark without-padding"
					onClick={(e: any) => this.SendContext(new AttackMenuItem())}
				>
					<div class="fill-energy-power max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private RenderSpeed() {
		if (this.props.Item.HasPower()) {
			return (
				<button
					type="button"
					class="btn btn-dark without-padding"
					onClick={(e: any) => this.SendContext(new SpeedFieldMenuItem())}
				>
					<div class="fill-energy-speed max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private RenderHeal() {
		if (this.props.Item.HasPower()) {
			return (
				<button
					type="button"
					class="btn btn-dark without-padding"
					onClick={(e: any) => this.SendContext(new HealMenuItem())}
				>
					<div class="fill-energy-heal max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}
}
