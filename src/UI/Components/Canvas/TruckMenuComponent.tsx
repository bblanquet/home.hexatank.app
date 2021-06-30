import { Component, h } from 'preact';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { InteractionContext } from '../../../Core/Interaction/InteractionContext';
import { Item } from '../../../Core/Items/Item';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import { AbortMenuItem } from '../../../Core/Menu/Buttons/AbortMenuItem';
import { CamouflageMenuItem } from '../../../Core/Menu/Buttons/CamouflageMenutItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { SearchMoneyMenuItem } from '../../../Core/Menu/Buttons/SearchMoneyMenuItem';

export default class TruckMenuComponent extends Component<
	{ Truck: Vehicle; isSettingPatrol: boolean; Interaction: InteractionContext },
	{}
> {
	constructor() {
		super();
	}
	private SendContext(item: Item): void {
		const interaction = this.props.Interaction;
		interaction.Kind = InteractionKind.Up;
		return interaction.OnSelect(item);
	}

	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button type="button" class="btn btn-light without-padding">
							{this.props.Truck.Id}
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new SearchMoneyMenuItem())}
						>
							<div class="fill-searchMoney max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new CamouflageMenuItem())}
						>
							<div class="fill-camouflage max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new AbortMenuItem())}
						>
							<div class="fill-abort max-width standard-space" />
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
}
