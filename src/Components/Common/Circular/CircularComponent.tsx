import { h, Component } from 'preact';
import { Point } from '../../../Core/Utils/Geometry/Point';
import { BtnInfo } from './BtnInfo';

export default class CircularComponent extends Component<
	{ btns: BtnInfo[]; OnCancel: () => void },
	{ btns: BtnInfo[] }
> {
	private _positions: Point[] = [];
	constructor() {
		super();
		this.setState({
			btns: []
		});
	}

	componentWillMount() {
		if (this.props.btns) {
			this.InitPositions();
		}
	}

	private SetPositions() {
		this._positions = [];
		this.props.btns.forEach((btn, index) => {
			this._positions.push(this.GetPoint(index, this.props.btns.length));
		});
		this.setState({});
	}

	private InitPositions() {
		this.props.btns.forEach((btn, index) => {
			this._positions.push(new Point(0, 0));
		});
	}

	componentDidMount() {
		if (this.props.btns) {
			this.setState({
				btns: this.props.btns
			});
			setTimeout(() => {
				this.SetPositions();
			}, 700);
		}
	}

	componentDidUpdate(prevProps: any, prevState: any) {}

	private GetPoint(i: number, total: number): Point {
		const x = Math.cos(i * 2 * Math.PI / total) * 150;
		const y = Math.sin(i * 2 * Math.PI / total) * 150;
		return new Point(x, y);
	}

	componentWillUnmount() {}

	private Btn(btn: BtnInfo, point: Point) {
		return (
			<div
				className="btn btn-dark btn-circular "
				style={`transform:translate(${point.X}px,${point.Y}px); opacity:${point.IsOrigin() ? 0 : 1}`}
			>
				<div class="max-space container-center" onClick={() => btn.CallBack()}>
					<div class={`${btn.ClassName} circular-space`} />
					<div>
						{btn.Amount} <span class="fill-diamond badge very-small-space middle"> </span>
					</div>
				</div>
			</div>
		);
	}

	private CancelLogo() {
		return (
			<div class="max-space container-center">
				<div class="fill-cancel max-width standard-space" />
			</div>
		);
	}

	render() {
		return (
			<div class="circular-menu">
				<div
					onClick={() => this.props.OnCancel()}
					class="btn btn-dark btn-circular above-circular bouncing-up-animation"
				>
					{this.CancelLogo()}
				</div>
				{this.state.btns.map((btn, index) => {
					return this.Btn(btn, this._positions[index]);
				})}
			</div>
		);
	}
}
