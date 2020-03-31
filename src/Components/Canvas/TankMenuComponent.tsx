import { Component, h } from 'preact';
import { PatrolMenuItem } from '../../Core/Menu/Buttons/PatrolMenuItem';
import { TargetMenuItem } from '../../Core/Menu/Buttons/TargetMenuItem';
import { CamouflageMenuItem } from '../../Core/Menu/Buttons/CamouflageMenutItem';
import { AbortMenuItem } from '../../Core/Menu/Buttons/AbortMenuItem';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { Item } from '../../Core/Items/Item';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';

export default class TankMenuComponent extends Component<{}, {}> {
	private SendContext(item: Item): void {
		GameHelper.InteractionContext.Kind = InteractionKind.Up;
		return GameHelper.InteractionContext.OnSelect(item);
	}

	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new PatrolMenuItem())}
						>
							<div class="white-background">{false ? 'ON' : 'OFF'}</div>
							<div class="fill-patrol max-width standard-space" />
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
