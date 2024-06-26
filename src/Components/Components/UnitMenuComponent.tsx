import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { Component, h } from 'preact';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { Item } from '../../Core/Items/Item';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { Singletons, SingletonKey } from '../../Singletons';
import { Gameworld } from '../../Core/Framework/World/Gameworld';

export default class UnitMenuComponent extends Component<{ Vehicle: Vehicle }, {}> {
	private _interactionService: IInteractionService<Gameworld>;
	componentDidMount(): void {
		this._interactionService = Singletons.Load<IInteractionService<Gameworld>>(SingletonKey.RecordInteraction);
	}

	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button type="button" class="btn btn-light without-padding">
							<div>{this.props.Vehicle.Id}</div>
							<div>{this.props.Vehicle.GetCurrentCell().Coo()}</div>
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
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		return interaction.OnSelect(item);
	}
}
