import { Component, h } from 'preact';
import { PlusMenuItem } from '../../../../Core/Menu/Buttons/PlusMenuItem';
import { MinusMenuItem } from '../../../../Core/Menu/Buttons/MinusMenuItem';
import { CancelMenuItem } from '../../../../Core/Menu/Buttons/CancelMenuItem';
import { ReactorField } from '../../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Item } from '../../../../Core/Items/Item';
import { InteractionKind } from '../../../../Core/Interaction/IInteractionContext';
import { AttackMenuItem } from '../../../../Core/Menu/Buttons/AttackMenuItem';
import { SpeedFieldMenuItem } from '../../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { HealMenuItem } from '../../../../Core/Menu/Buttons/HealMenuItem';
import * as moment from 'moment';
import { InteractionContext } from '../../../../Core/Interaction/InteractionContext';

export default class ReactorMenuComponent extends Component<
	{ Item: ReactorField; Interaction: InteractionContext },
	{ timeout: number }
> {
	constructor() {
		super();
	}
	componentDidMount(): void {
		this.Check();
	}

	componentDidUpdate(): void {
		this.Check();
	}

	private Check() {
		const reactor = this.props.Item as ReactorField;
		if (reactor.IsLocked()) {
			setTimeout(() => {
				this.Update(reactor);
			}, 300);
		} else {
			if (this.state.timeout !== 0) {
				this.setState({ timeout: 0 });
			}
		}
	}

	private Update(reactor: ReactorField) {
		const overlocked = new Date(reactor.GetLockDate()).getTime();
		const now = new Date().getTime();
		if (now < overlocked) {
			this.setState({ timeout: overlocked - now });
		} else {
			this.setState({ timeout: 0 });
		}
	}

	render() {
		const reactor = this.props.Item as ReactorField;
		if (reactor.IsLocked()) {
			return (
				<div class="left-column">
					<div class="middle2 max-width">
						<div class="btn-group-vertical max-width">
							<button type="button" class="btn btn-light without-padding">
								<div class="fill-energy max-width standard-space" />
								<div class="max-width align-text-center darker">
									{reactor.Reserve.GetUsedPower()}/{reactor.Reserve.GetTotalBatteries()}
								</div>
							</button>
							<button type="button" class="btn btn-light without-padding">
								<div class="fill-overlocked max-width standard-space" />
								<div class="max-width align-text-center overlocked">
									{moment(this.state.timeout).format('ss.SS')}
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
			);
		} else {
			return (
				<div class="left-column">
					<div class="middle2 max-width">
						<div class="btn-group-vertical max-width">
							<button type="button" class="btn btn-light without-padding">
								<div class="fill-energy max-width standard-space" />
								<div class="max-width align-text-center darker">
									{reactor.Reserve.GetUsedPower()}/{reactor.Reserve.GetTotalBatteries()}
								</div>
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new PlusMenuItem())}
							>
								<div class="fill-plus max-width standard-space" />
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.SendContext(new MinusMenuItem())}
							>
								<div class="fill-minus max-width standard-space" />
							</button>
							{this.RenderAttack()}
							{this.RenderHeal()}
							{this.RenderSpeed()}
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

	private RenderAttack() {
		if (this.props.Item.HasPower()) {
			return (
				<button
					type="button"
					class="btn btn-danger without-padding"
					onClick={(e: any) => this.SendContext(new AttackMenuItem())}
				>
					<div class="fill-energy-power max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private RenderSpeed() {
		if (this.props.Item.HasPower()) {
			return (
				<button
					type="button"
					class="btn btn-danger without-padding"
					onClick={(e: any) => this.SendContext(new SpeedFieldMenuItem())}
				>
					<div class="fill-energy-speed max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private RenderHeal() {
		if (this.props.Item.HasPower()) {
			return (
				<button
					type="button"
					class="btn btn-danger without-padding"
					onClick={(e: any) => this.SendContext(new HealMenuItem())}
				>
					<div class="fill-energy-heal max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private SendContext(item: Item): void {
		this.props.Interaction.Kind = InteractionKind.Up;
		this.props.Interaction.OnSelect(item);
	}
}
