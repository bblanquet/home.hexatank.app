import { h, Component } from 'preact';
import { route } from 'preact-router';
import { BarChart } from '../Common/Chart/Config/BarChart';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';
import ChartContainer from '../Common/Chart/ChartContainer';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { Singletons, SingletonKey } from '../../Singletons';

export default class BarComparisonComponent extends Component<{}, { Canvas: HTMLCanvasElement }> {
	private _chart: BarChart;
	private _compareService: ICompareService;
	private _func: any = this.OnClicked.bind(this);
	private _label: string;
	private _ref: HTMLSpanElement;
	constructor() {
		super();
		this._chart = new BarChart();
		this._chart.OnClickElement.On(this._func);
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
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
				Canvas: this._chart.GetCanvas('', this._compareService.GetCellDelta())
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
				<SmPanelComponent>
					<div class="statContainer container-center-horizontal menu-container">
						<div class="container-center">
							<ChartContainer canvas={this.state.Canvas} height={40} />
							<span class="badge badge-light" ref={(d) => (this._ref = d)} />;
							<div class="container-center-horizontal">
								<ButtonComponent
									callBack={() => {
										route('{{sub_path}}Home', true);
									}}
									color={ColorKind.Black}
								>
									<Icon Value="fas fa-undo-alt" /> Quit
								</ButtonComponent>
								<ButtonComponent
									callBack={() => {
										route('{{sub_path}}LineComparison', true);
									}}
									color={ColorKind.Blue}
								>
									<Icon Value="fas fa-chart-line" /> Comparison
								</ButtonComponent>
							</div>
						</div>
					</div>
				</SmPanelComponent>
			</Redirect>
		);
	}
}
