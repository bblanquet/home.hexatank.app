import { h, Component } from 'preact';
import { BarChart } from '../Common/Chart/Config/BarChart';
import Redirect from '../Redirect/RedirectComponent';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';
import ChartContainer from '../Common/Chart/ChartContainer';
import { StatusDuration } from '../Common/Chart/Model/StatusDuration';
import { Dictionary } from '../../Core/Utils/Collections/Dictionary';

export default class BarComparisonComponent extends Component<
	{ Data: Dictionary<StatusDuration[]> },
	{ Canvas: HTMLCanvasElement }
> {
	private _chart: BarChart;
	private _func: any = this.OnClicked.bind(this);
	private _label: string;
	private _ref: HTMLSpanElement;
	constructor() {
		super();
		this._chart = new BarChart();
		this._chart.OnClickElement.On(this._func);
		this._label = 'none';
	}

	private OnClicked(src: any, label: string): void {
		this._label = label;
		this._ref.innerHTML = '';
		this._ref.innerText = this._label;
	}

	componentDidMount() {
		this.UpdateCanvas();
	}

	componentWillUnmount() {
		this._chart.OnClickElement.Off(this._func);
	}

	private UpdateCanvas() {
		if (!this.state.Canvas) {
			this.setState({
				Canvas: this._chart.GetCanvas('', this.props.Data)
			});
		}
	}

	componentDidUpdate() {
		this.UpdateCanvas();
		if (this.state.Canvas) {
			this.state.Canvas.autofocus = true;
			this.state.Canvas.focus();
		}
	}

	render() {
		return (
			<Redirect>
				<div class="statContainer container-center-horizontal menu-container">
					<div class="container-center">
						<ChartContainer canvas={this.state.Canvas} height={40} />
						<span class="badge badge-light" ref={(d) => (this._ref = d)} />;
					</div>
				</div>
			</Redirect>
		);
	}
}
