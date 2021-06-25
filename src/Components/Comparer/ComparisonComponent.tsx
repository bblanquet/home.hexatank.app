import { Component, h } from 'preact';
import { ICompareService } from '../../Services/Compare/ICompareService';
import { SingletonKey, Singletons } from '../../Singletons';
import SmPanelComponent from '../Common/Panel/SmPanelComponent';
import Visible from '../Common/Visible/VisibleComponent';
import BarComparisonComponent from './BarComparisonComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { route } from 'preact-router';
import LineComparisonComponent from './LineComparisonComponent';
import ActiveButtonComponent from '../Common/Button/Stylish/ActiveButtonComponent';
import LogComponent from './LogComponent';

export default class ComparisonComponent extends Component<{}, { Value: ComparisonState }> {
	private _compareService: ICompareService;
	constructor() {
		super();
		this._compareService = Singletons.Load<ICompareService>(SingletonKey.Compare);
		this.setState({
			Value: ComparisonState.Vehicle
		});
	}

	render() {
		return (
			<SmPanelComponent>
				<div class="container-center-horizontal">
					{this.Button(ComparisonState.Cell, 'far fa-map')}
					{this.Button(ComparisonState.Curve, 'fas fa-chart-line')}
					{this.Button(ComparisonState.Vehicle, 'fas fa-arrows-alt')}
					{this.Button(ComparisonState.Logs, 'fas fa-stream')}
				</div>

				<Visible isVisible={this.state.Value === ComparisonState.Cell}>
					<BarComparisonComponent Data={this._compareService.GetCellDelta()} />
				</Visible>
				<Visible isVisible={this.state.Value === ComparisonState.Vehicle}>
					<BarComparisonComponent Data={this._compareService.GetVehicleDelta()} />
				</Visible>
				<Visible isVisible={this.state.Value === ComparisonState.Curve}>
					<LineComparisonComponent />
				</Visible>
				<Visible isVisible={this.state.Value === ComparisonState.Logs}>
					<LogComponent messages={this._compareService.GetLogs()} />
				</Visible>
				<div class="container-center-horizontal">
					<ButtonComponent callBack={() => route('{{sub_path}}Home', true)} color={ColorKind.Black}>
						<Icon Value="fas fa-undo-alt" /> Quit
					</ButtonComponent>
				</div>
			</SmPanelComponent>
		);
	}

	private Button(state: ComparisonState, icon: string) {
		return (
			<ActiveButtonComponent
				isActive={this.state.Value === state}
				leftColor={ColorKind.Red}
				rightColor={ColorKind.Black}
				left={<Icon Value={icon} />}
				right={<Icon Value={icon} />}
				callBack={() => {
					this.setState({
						Value: state
					});
				}}
			/>
		);
	}
}

export enum ComparisonState {
	Vehicle,
	Cell,
	Curve,
	Logs
}
