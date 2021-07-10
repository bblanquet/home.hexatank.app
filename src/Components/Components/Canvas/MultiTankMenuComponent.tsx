import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import { AbortMenuItem } from '../../../Core/Menu/Buttons/AbortMenuItem';
import { CamouflageMenuItem } from '../../../Core/Menu/Buttons/CamouflageMenutItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { MultiOrderMenuItem } from '../../../Core/Menu/Buttons/MultiOrderMenuItem';

export default class MultiTankMenuComponent extends Component<
	{
		item: UnitGroup;
		callback: (e: Item) => void;
	},
	{}
> {
	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<button
							type="button"
							class={
								!this.props.item.IsListeningOrder ? (
									'btn btn-light without-padding'
								) : (
									'btn btn-primary without-padding'
								)
							}
							onClick={(e: any) => this.props.callback(new MultiOrderMenuItem())}
						>
							<div class="white-background">{this.props.item.IsListeningOrder ? 'ON' : 'OFF'}</div>
							<div class="fill-active-order max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.props.callback(new CamouflageMenuItem())}
						>
							<div class="fill-camouflage max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.props.callback(new AbortMenuItem())}
						>
							<div class="fill-abort max-width standard-space" />
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.props.callback(new CancelMenuItem())}
						>
							<div class="fill-cancel max-width standard-space" />
						</button>
					</div>
				</div>
			</div>
		);
	}
}
