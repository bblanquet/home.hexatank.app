import { Component, h } from 'preact';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { Item } from '../../../Core/Items/Item';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { TankMenuItem } from '../../../Core/Menu/Buttons/TankMenuItem';
import { TruckMenuItem } from '../../../Core/Menu/Buttons/TruckMenuItem';

export default class HqMenuComponent extends Component<
	{
		TankRequestCount: number;
		TruckRequestCount: number;
		VehicleCount: number;
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
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.props.callback(new TankMenuItem())}
						>
							<div class="white-background">{this.props.TankRequestCount}</div>
							<div class="fill-tank max-width standard-space" />
							<div class="max-width align-text-center darker">
								{GameSettings.TankPrice * this.props.VehicleCount}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.props.callback(new TruckMenuItem())}
						>
							<div class="white-background">{this.props.TruckRequestCount}</div>
							<div class="fill-truck max-width standard-space" />
							<div class="max-width align-text-center darker">
								{GameSettings.TruckPrice * this.props.VehicleCount}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
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
