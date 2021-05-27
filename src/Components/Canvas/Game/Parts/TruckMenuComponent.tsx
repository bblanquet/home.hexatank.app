import { Component, h } from 'preact';
import { Item } from '../../../../Core/Items/Item';
import { InteractionKind } from '../../../../Core/Interaction/IInteractionContext';
import { PatrolMenuItem } from '../../../../Core/Menu/Buttons/PatrolMenuItem';
import { SearchMoneyMenuItem } from '../../../../Core/Menu/Buttons/SearchMoneyMenuItem';
import { AbortMenuItem } from '../../../../Core/Menu/Buttons/AbortMenuItem';
import { CancelMenuItem } from '../../../../Core/Menu/Buttons/CancelMenuItem';
import { Vehicle } from '../../../../Core/Items/Unit/Vehicle';
import { Factory, FactoryKey } from '../../../../Factory';
import { IInteractionService } from '../../../../Services/Interaction/IInteractionService';
import { GameContext } from '../../../../Core/Framework/GameContext';

export default class TruckMenuComponent extends Component<{ Truck: Vehicle; isSettingPatrol: boolean }, {}> {
	private _interactionService: IInteractionService<GameContext>;
	constructor() {
		super();
		this._interactionService = Factory.Load<IInteractionService<GameContext>>(FactoryKey.Interaction);
	}
	private SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
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
							class={
								this.props.isSettingPatrol ? (
									'btn btn-light without-padding'
								) : (
									'btn btn-dark without-padding'
								)
							}
							onClick={(e: any) => this.SendContext(new PatrolMenuItem())}
						>
							<div class="white-background">{this.props.isSettingPatrol ? 'ON' : 'OFF'}</div>
							<div class="fill-patrol max-width standard-space" />
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
