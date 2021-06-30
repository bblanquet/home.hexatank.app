import * as luxon from 'luxon';
import { h, Component } from 'preact';
import { Dictionary } from '../../../Core/Utils/Collections/Dictionary';
import { ColorKind } from '../Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Button/Stylish/SmActiveButtonComponent';
import Icon from '../Icon/IconComponent';

export default class RangeComponent extends Component<
	{ onChange: (e: number) => void; dataSet: number[] },
	{ value: number; isActive: boolean }
> {
	private _toolTip: HTMLElement;
	private _input: HTMLInputElement;
	private _indexes: Dictionary<number> = new Dictionary<number>();
	constructor() {
		super();
	}

	componentDidMount() {
		if (!this.state.value) {
			this.setState({
				value: this.props.dataSet[0]
			});
		}
	}

	componentDidUpdate() {
		this.SetPosition(this._input, this._toolTip);
	}

	private SetPosition(range: any, rangeV: any) {
		const newValue = Number((range.value - range.min) * 100 / (range.max - range.min));
		const newPosition = 10 - newValue * 0.2;
		rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
	}

	private GetStyle(): string {
		return 'padding:5px 5px 5px 5px; background: rgb(255,255,255);background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 100%);';
	}

	private Pushed(): void {
		this.setState({ isActive: !this.state.isActive });
		this.Play();
	}

	private Play(): void {
		setTimeout(() => {
			if (this.state.isActive) {
				if (this._indexes.IsEmpty()) {
					this.props.dataSet.forEach((d, index) => {
						this._indexes.Add(d.toString(), index);
					});
				}
				const index = this._indexes.Get(this.state.value.toString()) + 1;
				const value = this.props.dataSet[index];
				this._input.value = value.toString();
				this.setState({
					value: value
				});
				this.props.onChange(this.state.value);
				this.Play();
			}
		}, 500);
	}

	render() {
		return (
			<div>
				<div class="container-center-horizontal" style={this.GetStyle()}>
					<SmActiveButtonComponent
						left={<Icon Value={'fas fa-play'} />}
						right={<Icon Value={'fas fa-pause'} />}
						leftColor={ColorKind.Black}
						rightColor={ColorKind.Blue}
						callBack={() => this.Pushed()}
						isActive={this.state.isActive}
					/>
					<div class="range-wrap" style="margin:5px 5px 5px 5px;">
						<div
							class="range-value unselectable fit-content fit-height"
							ref={(dom) => {
								this._toolTip = dom;
							}}
						>
							<div class="btn-space">
								{luxon.Duration
									.fromObject({
										milliseconds: this.state.value ? this.state.value - this.props.dataSet[0] : 0
									})
									.toFormat('mm:ss.S')}
							</div>
						</div>
						<input
							ref={(dom) => {
								this._input = dom;
							}}
							class="custom-range"
							type="range"
							min={0 < this.props.dataSet.length ? this.props.dataSet[0] : 0}
							max={0 < this.props.dataSet.length ? this.props.dataSet[this.props.dataSet.length - 1] : 0}
							list="num"
							onInput={(e: any) => {
								this.setState({
									value: +e.target.value
								});
								this.props.onChange(this.state.value);
							}}
						/>
						<datalist id="num">
							{this.props.dataSet.map((data) => <option value={data} label={`${data}`} />)}
						</datalist>
					</div>
				</div>
			</div>
		);
	}
}
