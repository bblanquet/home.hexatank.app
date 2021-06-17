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
import { RecordData } from '../../Core/Framework/Record/RecordData';
import { contextA } from '../../contextA';
import { contextB } from '../../contextB';
import { RecordObject } from '../../Core/Framework/Record/RecordObject';

export default class BarComparisonComponent extends Component<{}, { Canvas: HTMLCanvasElement }> {
	private _chartProvider: BarChart;

	constructor() {
		super();
		this._chartProvider = new BarChart();
	}

	componentDidMount() {
		this.UpdateCanvas();
	}

	private UpdateCanvas() {
		if (!this.state.Canvas) {
			this.setState({
				Canvas: this._chartProvider.GetChart(
					new DurationStateFormater().Format(
						RecordData.To(contextA as RecordObject),
						RecordData.To(contextB as RecordObject)
					)
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
