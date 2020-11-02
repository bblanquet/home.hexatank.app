import { h, Component, toChildArray, cloneElement } from 'preact';
import { Point } from '../../../Core/Utils/Geometry/Point';

export default class CircularComponent extends Component<{ OnCancel: () => void; isDark: boolean }, {}> {
	private _positions: Point[] = [];
	constructor() {
		super();
		this.setState({});
	}

	componentWillMount() {
		if (this.props.children) {
			this._positions = [];
			(this.props.children as any[]).forEach((c) => {
				this._positions.push(new Point(0, 0));
			});
		}
	}

	private SetPositions() {
		this._positions = [];
		const children = toChildArray(this.props.children);
		const size = children.length;
		(this.props.children as any[]).forEach((c, index) => {
			this._positions.push(this.GetPoint(index, size));
		});
		this.setState({});
	}

	componentDidMount() {
		if (this.props.children) {
			this.setState({});
			setTimeout(() => {
				this.SetPositions();
			}, 10);
		}
	}

	private GetPoint(i: number, total: number): Point {
		const x = Math.cos(i * 2 * Math.PI / total) * 125;
		const y = Math.sin(i * 2 * Math.PI / total) * 125;
		return new Point(x, y);
	}

	componentWillUnmount() {}

	private CancelLogo() {
		return (
			<div class="max-space container-center">
				<div class="fill-cancel max-width standard-space" />
			</div>
		);
	}

	Convert(child: any, index: number) {
		return cloneElement(child, { Point: this._positions[index] });
	}

	render() {
		return (
			<div class="circular-menu">
				<div
					onClick={() => this.props.OnCancel()}
					class={`btn ${this.props.isDark
						? 'btn-dark'
						: 'btn-light'} btn-circular above-circular bouncing-up-animation`}
				>
					{this.CancelLogo()}
				</div>
				{toChildArray(this.props.children).map((child, i) => {
					return this.Convert(child, i);
				})}
			</div>
		);
	}
}
