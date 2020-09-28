import { Component, h } from 'preact';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { Item } from '../../../Core/Items/Item';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../../../Core/App/AppHandler';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';

export default class UnitMenuComponent extends Component<{ AppHandler: AppHandler; Vehicle: Vehicle }, {}> {
	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}

	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button type="button" class="btn btn-light without-padding">
							{this.props.Vehicle.Id}
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
