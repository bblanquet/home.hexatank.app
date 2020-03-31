import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { Item } from '../../Core/Items/Item';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { TankMenuItem } from '../../Core/Menu/Buttons/TankMenuItem';
import { TruckMenuItem } from '../../Core/Menu/Buttons/TruckMenuItem';

export default class HqMenuComponent extends Component<
	{
		TankRequestCount: number;
		TruckRequestCount: number;
		HasFlag: boolean;
		SetFlag: () => void;
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
							onClick={(e: any) => this.SendContext(new TankMenuItem())}
						>
							<div class="white-background">{this.props.TankRequestCount}</div>
							<div class="fill-tank max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.TankPrice * GameHelper.PlayerHeadquarter.GetVehicleCount()}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.SendContext(new TruckMenuItem())}
						>
							<div class="white-background">{this.props.TruckRequestCount}</div>
							<div class="fill-truck max-width standard-space" />
							<div class="max-width text-center darker">
								{GameSettings.TruckPrice * GameHelper.PlayerHeadquarter.GetVehicleCount()}{' '}
								<span class="fill-diamond badge very-small-space middle"> </span>
							</div>
						</button>
						<button
							type="button"
							class="btn btn-dark without-padding"
							onClick={(e: any) => this.props.SetFlag()}
						>
							<div class="white-background">{this.props.HasFlag ? 'ON' : 'OFF'}</div>
							<div class="fill-flag max-width standard-space" />
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
		GameHelper.InteractionContext.Kind = InteractionKind.Up;
		return GameHelper.InteractionContext.OnSelect(item);
	}
}
