import { JSX, h } from 'preact';
import { route } from 'preact-router';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import Visible from '../Components/Visible';
import LineComparisonComponent from '../Components/LineComparisonComponent';
import BarComparisonComponent from '../Components/BarComparisonComponent';
import LogComponent from '../Components/LogComponent';
import { ComparisonState } from '../Model/ComparisonState';
import { ComparisonHook } from '../Hooks/ComparisonHook';
import { HookedComponent } from '../Hooks/HookedComponent';
import { useState } from 'preact/hooks';
import Struct from '../Components/Struct';
import Navbar from '../Components/Navbar';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import { ComparisonKind } from '../Model/ComparisonKind';

export default class ComparisonScreen extends HookedComponent<{}, ComparisonHook, ComparisonState> {
	public GetDefaultHook(): ComparisonHook {
		return new ComparisonHook(useState(ComparisonHook.DefaultState()));
	}

	private Button(state: ComparisonKind, icon: string) {
		return (
			<SmActiveBtn
				isActive={this.Hook.State.Kind === state}
				leftColor={ColorKind.Red}
				rightColor={ColorKind.Black}
				left={<Icon Value={icon} />}
				right={<Icon Value={icon} />}
				callBack={() => this.Hook.ChangeState(state)}
			/>
		);
	}

	public Rendering(): JSX.Element {
		return (
			<Struct
				header={
					<Navbar>
						{this.Button(ComparisonKind.Cell, 'far fa-map')}
						{this.Button(ComparisonKind.Curve, 'fas fa-chart-line')}
						{this.Button(ComparisonKind.Vehicle, 'fas fa-arrows-alt')}
						{this.Button(ComparisonKind.Logs, 'fas fa-stream')}
					</Navbar>
				}
				content={
					<span>
						<Visible isVisible={this.Hook.State.Kind === ComparisonKind.Cell}>
							<BarComparisonComponent Data={this.Hook.GetCellDelta()} />
						</Visible>
						<Visible isVisible={this.Hook.State.Kind === ComparisonKind.Vehicle}>
							<BarComparisonComponent Data={this.Hook.GetVehicleDelta()} />
						</Visible>
						<Visible isVisible={this.Hook.State.Kind === ComparisonKind.Curve}>
							<LineComparisonComponent />
						</Visible>
						<Visible isVisible={this.Hook.State.Kind === ComparisonKind.Logs}>
							<LogComponent Messages={this.Hook.GetLogs()} />
						</Visible>
					</span>
				}
				footer={
					<div class="navbar nav-inner">
						<SmBtn callBack={() => route('{{sub_path}}Home', true)} color={ColorKind.Black}>
							<Icon Value="fas fa-undo-alt" /> Quit
						</SmBtn>
					</div>
				}
			/>
		);
	}
}
