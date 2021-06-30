import { Component, h } from 'preact';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { InteractionContext } from '../../../Core/Interaction/InteractionContext';
import { Item } from '../../../Core/Items/Item';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import { AbortMenuItem } from '../../../Core/Menu/Buttons/AbortMenuItem';
import { CamouflageMenuItem } from '../../../Core/Menu/Buttons/CamouflageMenutItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { TargetMenuItem } from '../../../Core/Menu/Buttons/TargetMenuItem';

export default class TankMenuComponent extends Component<
	{ Tank: Vehicle; isSettingPatrol: boolean; Interaction: InteractionContext },
	{}
> {
	constructor() {
		super();
	}
	private SendContext(item: Item): void {
		this.props.Interaction.Kind = InteractionKind.Up;
		this.props.Interaction.OnSelect(item);
	}

	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button type="button" class="btn btn-light without-padding">
							{this.props.Tank.Id}
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new TargetMenuItem())}
						>
							<div class="fill-target max-width standard-space" />
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
