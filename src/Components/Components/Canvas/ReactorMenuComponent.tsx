import { Component, h } from 'preact';
import * as luxon from 'luxon';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Item } from '../../../Core/Items/Item';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { MinusMenuItem } from '../../../Core/Menu/Buttons/MinusMenuItem';
import { PlusMenuItem } from '../../../Core/Menu/Buttons/PlusMenuItem';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';

export default class ReactorMenuComponent extends Component<
	{
		Item: ReactorField;
		callback: (e: Item) => void;
	},
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
									{luxon.Duration.fromObject({ milliseconds: this.state.timeout }).toFormat('ss.SS')}
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
								onClick={(e: any) => this.props.callback(new PlusMenuItem())}
							>
								<div class="fill-plus max-width standard-space" />
							</button>
							<button
								type="button"
								class="btn btn-dark without-padding"
								onClick={(e: any) => this.props.callback(new MinusMenuItem())}
							>
								<div class="fill-minus max-width standard-space" />
							</button>
							{this.RenderAttack()}
							{this.RenderHeal()}
							{this.RenderSpeed()}
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

	private RenderAttack() {
		if (this.props.Item.HasEnergy()) {
			return (
				<button
					type="button"
					class="btn btn-danger without-padding"
					onClick={(e: any) => this.props.callback(new AttackMenuItem())}
				>
					<div class="fill-energy-power max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private RenderSpeed() {
		if (this.props.Item.HasEnergy()) {
			return (
				<button
					type="button"
					class="btn btn-danger without-padding"
					onClick={(e: any) => this.props.callback(new SpeedFieldMenuItem())}
				>
					<div class="fill-energy-speed max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}

	private RenderHeal() {
		if (this.props.Item.HasEnergy()) {
			return (
				<button
					type="button"
					class="btn btn-danger without-padding"
					onClick={(e: any) => this.props.callback(new HealMenuItem())}
				>
					<div class="fill-energy-heal max-width standard-space" />
				</button>
			);
		} else {
			return '';
		}
	}
}
