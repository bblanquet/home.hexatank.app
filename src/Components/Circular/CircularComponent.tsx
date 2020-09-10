import { h, Component } from 'preact';
import { BtnInfo } from './BtnInfo';

export default class CircularComponent extends Component<
	{ btns: BtnInfo[]; OnCancel: () => void },
	{ btns: BtnInfo[] }
> {
	private _toggleDiv: HTMLInputElement;

	constructor() {
		super();
		this.setState({
			btns: []
		});
	}

	componentDidMount() {
		if (this.props.btns) {
			this.setState({
				btns: this.props.btns
			});
		}
	}

	componentWillUnmount() {
		this._toggleDiv.checked = false;
	}

	componentDidUpdate() {
		if (this._toggleDiv && !this._toggleDiv.checked) {
			this._toggleDiv.checked = true;
			setTimeout(() => {
				if (this._toggleDiv && !this._toggleDiv.checked) {
				}
			}, 50);
		}
	}

	private Btn(className: string, amount: number, callback: () => void) {
		return (
			<div class="max-space container-center" onClick={callback}>
				<div class={`${className} circular-space`} />
				<div>
					{amount} <span class="fill-diamond badge very-small-space middle"> </span>
				</div>
			</div>
		);
	}

	private Cancel() {
		return (
			<div class="max-space container-center">
				<div class="fill-cancel max-width standard-space" />
			</div>
		);
	}

	render() {
		return (
			<div class="circular-menu">
				<input
					type="checkbox"
					id="toggle"
					ref={(dom) => {
						this._toggleDiv = dom;
					}}
				/>
				<label id="show-menu" for="toggle">
					<div onClick={() => this.props.OnCancel()} class="btn btn-dark btn-circular above-circular">
						{this.Cancel()}
					</div>
					{this.state.btns.map((btn) => {
						return (
							<button class="btn btn-dark btn-circular">
								{this.Btn(btn.ClassName, btn.Amount, btn.CallBack)}
							</button>
						);
					})}
				</label>
			</div>
		);
	}
}
