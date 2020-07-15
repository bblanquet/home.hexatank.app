import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { InfluenceMenuItem } from '../../../Core/Menu/Buttons/InfluenceMenuItem';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../../Core/Menu/Buttons/PoisonMenuItem';
import { ShieldMenuItem } from '../../../Core/Menu/Buttons/ShieldMenuItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { AppHandler } from '../AppHandler';
import { GameContext } from '../../../Core/Framework/GameContext';
import { NetworkMenuItem } from '../../../Core/Menu/Buttons/NetworkMenuItem';
import { ThunderMenuItem } from '../../../Core/Menu/Buttons/ThunderMenuItem';

export default class CellMenuComponent extends Component<
	{ Item: Item; AppHandler: AppHandler; GameContext: GameContext },
	{}
> {
	render() {
		return (
			<div class="left-column">
				<div class="middle2 max-width" style="max-height:100vh">
					<div class="middle2 max-width" style="max-height:80vh;overflow-y: scroll;">
						<div class="btn-group-vertical max-width">
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new InfluenceMenuItem())}
							>
								<div class="fill-influence max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.TruckPrice * this.props.GameContext.MainHq.GetReactorsCount()}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new AttackMenuItem())}
							>
								<div class="fill-power max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new SpeedFieldMenuItem())}
							>
								<div class="fill-speed max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new HealMenuItem())}
							>
								<div class="fill-medic max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new MoneyMenuItem())}
							>
								<div class="fill-money max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new ThunderMenuItem())}
							>
								<div class="fill-thunder max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new NetworkMenuItem())}
							>
								<div class="fill-network max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new ShieldMenuItem())}
							>
								<div class="fill-shield max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new PoisonMenuItem())}
							>
								<div class="fill-poison max-width standard-space" />
								<div class="max-width align-text-center darker">
									{GameSettings.FieldPrice}{' '}
									<span class="fill-diamond badge very-small-space middle"> </span>
								</div>
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
			</div>
		);
	}

	private SendContext(item: Item): void {
		this.props.AppHandler.InteractionContext.Kind = InteractionKind.Up;
		return this.props.AppHandler.InteractionContext.OnSelect(item);
	}
}
