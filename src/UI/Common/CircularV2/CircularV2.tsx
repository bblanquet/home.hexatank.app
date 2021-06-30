import { h, Component, toChildArray, cloneElement } from 'preact';
import { Point } from '../../../Core/Utils/Geometry/Point';

export default class CircularV2Component extends Component<{ OnCancel: () => void }, {}> {
	private _positions: Point[] = [];
	private _parentDiv: HTMLDivElement;
	componentWillMount() {
		if (this.props.children) {
			const children = this.props.children as any[];
			const total = children.length;
			this._positions = [];
			children.forEach((child, i) => {
				const x = +(50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / total) * i * Math.PI)).toFixed(4);
				const y = +(50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / total) * i * Math.PI)).toFixed(4);
				this._positions.push(new Point(x, y));
			});
		}
	}

	Convert(child: any, index: number) {
		return cloneElement(child, { Point: this._positions[index] });
	}

	public IsAllHidden(): boolean {
		if (this._positions && 0 < this._positions.length) {
			return this._positions.every((e) => e.X === 0 && e.Y === 0);
		}
		return false;
	}

	componentDidMount() {
		setTimeout(() => {
			this._parentDiv.classList.toggle('open');
		}, 50);
	}

	componentWillUnmount() {
		this._parentDiv = null;
	}

	render() {
		return (
			<div
				class="circle"
				ref={(dom) => {
					this._parentDiv = dom;
				}}
			>
				<div class="ring">
					{toChildArray(this.props.children).map((child, i) => {
						return this.Convert(child, i);
					})}
				</div>
				<div
					class="center"
					onClick={(e: any) => {
						this.props.OnCancel();
					}}
				>
					<div class="circleContainer">
						<div class="fill-white-cancel max-width standard-space" />
					</div>
				</div>
			</div>
		);
	}
}
