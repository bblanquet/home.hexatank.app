import { Component, h } from 'preact';
import { PlusMenuItem } from '../../../Core/Menu/Buttons/PlusMenuItem';
import { MinusMenuItem } from '../../../Core/Menu/Buttons/MinusMenuItem';
import { BigMenuItem } from '../../../Core/Menu/Buttons/BigMenuItem';
import { SmallMenuItem } from '../../../Core/Menu/Buttons/SmallMenuItem';
import { GameHelper } from '../../../Core/Framework/GameHelper';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { InfluenceField } from '../../../Core/Items/Cell/Field/Bonus/InfluenceField';
import { Item } from '../../../Core/Items/Item';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../AppHandler';
import { GameContext } from '../../../Core/Framework/GameContext';

export default class FactoryMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{}
> {
	render() {
		const field = this.props.Item as InfluenceField;
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button type="button" class="btn btn-light without-padding">
							<div class="fill-energy max-width standard-space" />
							<div class="max-width text-center darker">
								{field.Battery.GetCurrentPower()}/{field.Battery.GetTotalPower()}
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new PlusMenuItem())}
						>
							<div class="fill-plus max-width standard-space" />
							{field.Battery.HasStock() ? (
								''
							) : (
								<div class="max-width text-center darker">
									{GameSettings.TruckPrice * this.props.GameContext.MainHq.GetTotalEnergy()}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							)}
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new MinusMenuItem())}
						>
							<div class="fill-minus max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new BigMenuItem())}
						>
							<div class="fill-big max-width standard-space" />
							{field.Battery.HasStock() ? (
								''
							) : (
								<div class="max-width text-center darker">
									{GameSettings.TruckPrice * this.props.GameContext.MainHq.GetTotalEnergy()}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							)}
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new SmallMenuItem())}
						>
							<div class="fill-small max-width standard-space" />
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
