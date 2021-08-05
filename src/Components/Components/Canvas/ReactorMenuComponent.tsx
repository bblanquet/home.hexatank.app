import { Component, h } from 'preact';
import * as luxon from 'luxon';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import MenuBtn from './MenuBtn';
import { ButtonProp } from './ButtonProp';
import Visible from '../../Common/Struct/Visible';
export default class ReactorMenuComponent extends Component<
	{
		Item: ReactorField;
		Btns: ButtonProp[];
	},
	{ timeout: number }
> {
	private _timeOut: NodeJS.Timeout;

	componentDidMount(): void {
		this.Check();
	}

	componentDidUpdate(): void {
		this.Check();
	}

	componentWillUnmount(): void {
		clearTimeout(this._timeOut);
	}

	private Check() {
		const reactor = this.props.Item as ReactorField;
		if (reactor.IsLocked()) {
			this._timeOut = setTimeout(() => {
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
		return (
			<div class="left-column">
				<div class="middle2 max-width">
					<div class="btn-group-vertical max-width">
						<Visible isVisible={this.props.Item.IsLocked()}>
							<button type="button" class="btn btn-dark without-padding">
								<div class="fill-overlocked max-width standard-space" />
								<div class="max-width align-text-center overlocked">
									{luxon.Duration.fromObject({ milliseconds: this.state.timeout }).toFormat('ss.S')}
								</div>
							</button>
						</Visible>
						{this.props.Btns.map((button) => <MenuBtn Btn={button} />)}
					</div>
				</div>
			</div>
		);
	}
}
