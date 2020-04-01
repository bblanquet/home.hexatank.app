import { Component, h } from 'preact';
import { Item } from '../../Core/Items/Item';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { PatrolMenuItem } from '../../Core/Menu/Buttons/PatrolMenuItem';
import { SearchMoneyMenuItem } from '../../Core/Menu/Buttons/SearchMoneyMenuItem';
import { AbortMenuItem } from '../../Core/Menu/Buttons/AbortMenuItem';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { AppHandler } from './AppHandler';

export default class TruckMenuComponent extends Component<{ AppHandler: AppHandler }, {}> {
	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
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
