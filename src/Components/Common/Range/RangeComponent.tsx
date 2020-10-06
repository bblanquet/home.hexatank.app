import * as moment from 'moment';
import { h, Component } from 'preact';
import SmActiveButtonComponent from '../Button/Stylish/SmActiveButtonComponent';
import Icon from '../Icon/IconComponent';

export default class RangeComponent extends Component<
	{ onChange: (e: any) => void; dataSet: number[] },
	{ value: string; isActive: boolean; currentValue: string }
> {
	private _toolTip: HTMLElement;
	private _input: HTMLInputElement;
	constructor() {
		super();
	}

	componentDidMount() {
		document.addEventListener('DOMContentLoaded', () => this.SetBubble(this._input, this._toolTip));
		this._input.addEventListener('input', () => this.SetBubble(this._input, this._toolTip));
	}

	componentDidUpdate() {
		if (!this.state.value) {
			this.setState({
				value: moment(new Date(this.props.dataSet[0])).format('mm:ss')
			});
		}
	}

	private SetBubble(range: any, rangeV: any) {
		const newValue = Number((range.value - range.min) * 100 / (range.max - range.min));
		const newPosition = 10 - newValue * 0.2;
		rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
	}

	private GetStyle(): string {
		return 'padding:5px 5px 5px 5px; background: rgb(255,255,255);background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 100%);';
	}

	render() {
		return (
			<div>
				<div class="container-center-horizontal" style={this.GetStyle()}>
					<SmActiveButtonComponent
						left={<Icon Value={'fas fa-play'} />}
						right={<Icon Value={'fas fa-pause'} />}
						callBack={() => {
							this.setState({ isActive: !this.state.isActive });
						}}
						isActive={this.state.isActive}
					/>
					<div class="range-wrap" style="margin:5px 5px 5px 5px;">
						<div
							class="range-value unselectable fit-content fit-height"
							ref={(dom) => {
								this._toolTip = dom;
							}}
						>
							<div class="btn-space">{this.state.value}</div>
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
								this.props.onChange(e);
								this.setState({
									value: moment(new Date(+e.target.value)).format('mm:ss')
								});
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
