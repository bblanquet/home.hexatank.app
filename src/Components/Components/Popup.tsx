import { h, Component } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { JsonRecordContent } from '../../Core/Framework/Record/Model/JsonRecordContent';
import { Groups } from '../../Utils/Collections/Groups';
import { Curve } from '../../Utils/Stats/Curve';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import { LineChart } from '../Common/Chart/Config/LineChart';
import Icon from '../Common/Icon/IconComponent';
import ChartContainer from '../Common/Chart/ChartContainer';
import TitleIcon from './TitleIcon';
import Visible from '../Common/Struct/Visible';
import Line from '../Common/Struct/Line';
import Column from '../Common/Struct/Column';
import { HookedComponent } from '../Hooks/HookedComponent';
import { PopupHook } from '../Hooks/PopupHook';
import { MockupPopHook } from '../Hooks/MockupPopHook';
import { PopupState } from '../Model/PopupState';
import { useState } from 'preact/hooks';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import AnimatedProgress from '../Common/Progress/AnimatedProgress';

export default class Popup extends HookedComponent<
	{ curves: Groups<Curve>; context: JsonRecordContent; status: GameStatus; Details: PointDetails },
	PopupHook,
	PopupState
> {
	public GetDefaultHook(): PopupHook {
		const chart = new LineChart();
		return new PopupHook(
			useState(
				new PopupState(
					chart,
					this.props.status,
					this.props.curves,
					StatsKind.Unit,
					chart.GetCanvas(StatsKind[StatsKind.Unit], this.props.curves.Get(StatsKind[StatsKind.Unit]))
				)
			)
		);
	}

	public Rendering(): h.JSX.Element {
		return (
			<div
				class="sizeContainer absolute-center-middle-menu menu-container fit-content"
				style={`border:${this.props.status === GameStatus.Victory ? 'gold' : 'crimson'} 5px solid`}
			>
				<TitleIcon Status={this.props.status} />
				<Column>
					<AnimatedProgress Width={80} MaxWidth={0} Details={this.props.Details} />
					<Line>
						{this.GetButton(StatsKind.Unit, 'fill-sm-tank max-width icon-space')}
						{this.GetButton(StatsKind.Cell, 'fill-sm-hexa max-width icon-space')}
						{this.GetButton(StatsKind.Diamond, 'fill-sm-diam max-width icon-space')}
						{this.GetButton(StatsKind.Energy, 'fill-sm-fire max-width icon-space')}
					</Line>
					<ChartContainer canvas={this.Hook.State.Canvas} height={null} />
					<Line>
						<Btn
							callBack={() => {
								this.Hook.Quit();
							}}
							color={ColorKind.Black}
						>
							<Icon Value="fas fa-undo-alt" /> Back
						</Btn>
						<Visible isVisible={this.Hook.HasRetry()}>
							<Btn
								callBack={() => {
									this.Hook.Retry();
								}}
								color={ColorKind.Blue}
							>
								<Icon Value="fas fa-undo-alt" /> Retry
							</Btn>
						</Visible>
					</Line>
				</Column>
			</div>
		);
	}

	private GetButton(kind: StatsKind, icon: string) {
		return (
			<SmActiveBtn
				left={<div class={icon} />}
				right={<div class={icon} />}
				leftColor={ColorKind.Black}
				rightColor={ColorKind.Red}
				isActive={this.Hook.State.Kind === kind}
				callBack={() => {
					this.Hook.UpdateState(kind);
				}}
			/>
		);
	}
}
