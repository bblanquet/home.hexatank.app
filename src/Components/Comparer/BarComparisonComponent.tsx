import { h, Component } from 'preact';
import { route } from 'preact-router';
import { BarChart } from '../Common/Chart/Config/BarChart';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';
import ChartContainer from '../Common/Chart/ChartContainer';
import { DurationStateFormater } from '../Common/Chart/Formater/DurationStateFormater';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { Singletons, SingletonKey } from '../../Singletons';
import Visible from '../Common/Visible/VisibleComponent';

export default class BarComparisonComponent extends Component<{}, { Canvas: HTMLCanvasElement; Label: string }> {
	private _chart: BarChart;
	private _compareService: ICompareService;
	private _func: any = this.OnClicked.bind(this);

	constructor() {
		super();
		this._chart = new BarChart();
		this._chart.OnClickElement.On(this._func);
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
	}

	private OnClicked(src: any, label: string): void {
		this.setState({
			Label: label
		});
	}

	componentDidMount() {
		this.UpdateCanvas();
	}

	componentWillUnmount() {
		this._chart.OnClickElement.Off(this._func);
	}

	private UpdateCanvas() {
		if (!this.state.Canvas) {
			const records = this._compareService.GetRecords();

			this.setState({
				Canvas: this._chart.GetCanvas(
					records[0].Title,
					new DurationStateFormater().Format(records[0], records[1])
				)
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
							<span class="badge badge-light">
								<Visible isVisible={this.state.Label !== undefined && this.state.Label !== null}>
									{this.state.Label}
								</Visible>
							</span>

							<div class="container-center-horizontal">
								<ButtonComponent
									callBack={() => {
										route('/Home', true);
									}}
									color={ColorKind.Black}
								>
									<Icon Value="fas fa-undo-alt" /> Quit
								</ButtonComponent>
								<ButtonComponent
									callBack={() => {
										route('/LineComparison', true);
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
