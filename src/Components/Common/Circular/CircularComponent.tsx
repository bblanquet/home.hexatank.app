import { h, Component } from 'preact';
import { JsxElement } from 'typescript';
import { Point } from '../../../Core/Utils/Geometry/Point';
import { BtnInfo } from './BtnInfo';

export default class CircularComponent extends Component<
	{ btns: BtnInfo[]; OnCancel: () => void },
	{ btns: BtnInfo[] }
> {
	private _cancelBtn: HTMLInputElement;
	private _otherBtns: HTMLDivElement[] = [];

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
			let i = 0;
			this.state.btns.forEach((btn) => {
				const div = document.createElement('div');
				div.className = 'btn btn-dark btn-circular';
				this.SetDivPosition(div, this.GetPoint(50, i, this.state.btns.length));
				div.onclick = () => btn.CallBack();
				this._otherBtns.push(div);
				i++;
			});
		}
	}

	private GetBtn(btn: BtnInfo) {
		return <button class="btn btn-dark btn-circular">{this.Btn(btn.ClassName, btn.Amount, btn.CallBack)}</button>;
	}

	componentDidUpdate(prevProps: any, prevState: any) {
		if (this._cancelBtn && !this._cancelBtn.checked) {
			this._cancelBtn.checked = true;
		}
	}

	private SetDivPosition(div: HTMLDivElement, point: Point) {
		div.style.left = `${point.X}px`;
		div.style.top = `${point.Y}px`;
	}

	private GetPoint(distance: number, i: number, total: number): Point {
		const x = Math.cos(distance * i * (Math.PI / 180)) * Math.round(window.innerHeight / 100) * total;
		const y = Math.sin(distance * i * (Math.PI / 180)) * Math.round(window.innerHeight / 100) * total;
		return new Point(x, y);
	}

	componentWillUnmount() {
		this._cancelBtn.checked = false;
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
						this._cancelBtn = dom;
					}}
				/>
				<label id="show-menu" for="toggle">
					<div
						onClick={() => this.props.OnCancel()}
						class="btn btn-dark btn-circular above-circular bouncing-up-animation"
					>
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
