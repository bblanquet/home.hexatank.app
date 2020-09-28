import * as moment from 'moment';
import { h, Component } from 'preact';
import SmBlackButtonComponent from '../Button/Stylish/SmBlackButtonComponent';

export default class RangeComponent extends Component<
	{ onChange: (e: any) => void; dataSet: number[] },
	{ value: string }
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="container-center-horizontal" style="padding:5px 5px 5px 5px; background: rgb(255,255,255);
            background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 100%);">
				<input
					class="custom-range"
					style="margin:5px 5px 5px 5px;"
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
				<SmBlackButtonComponent callBack={() => {}} title={this.state.value ? this.state.value : '00:00'} />
			</div>
		);
	}
}
