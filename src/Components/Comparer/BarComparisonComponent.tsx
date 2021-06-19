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

export default class BarComparisonComponent extends Component<{}, { Canvas: HTMLCanvasElement }> {
	private _chartProvider: BarChart;
	private _compareService: ICompareService;

	constructor() {
		super();
		this._chartProvider = new BarChart();
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
	}

	componentDidMount() {
		this.UpdateCanvas();
	}

	private UpdateCanvas() {
		if (!this.state.Canvas) {
			const records = this._compareService.GetRecords();

			this.setState({
				Canvas: this._chartProvider.GetCanvas(
					records[0].Title,
					new DurationStateFormater().Format(records[0], records[1])
				)
			});
		}
	}

	componentDidUpdate() {
		this.UpdateCanvas();
	}

	render() {
		return (
			<Redirect>
				<SmPanelComponent>
					<div class="statContainer container-center-horizontal menu-container">
						<div class="container-center">
							<ChartContainer canvas={this.state.Canvas} height={40} />
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
