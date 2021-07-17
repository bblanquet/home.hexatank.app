import { h } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import AnimatedProgress from '../Common/Progress/AnimatedProgress';
import { SmState } from '../Model/SmState';
import Visible from '../Common/Struct/Visible';
import { PointDetails } from '../../Services/PlayerProfil/PointDetails';
import Line from '../Common/Struct/Line';
import Column from '../Common/Struct/Column';
import { HookedComponent } from '../Hooks/HookedComponent';
import { SmPopupHook } from '../Hooks/SmPopupHook';
import { MockupSmHook } from '../Hooks/MockupSmHook';
import { useState } from 'preact/hooks';
import TitleIcon from './TitleIcon';

export default class SmPopup extends HookedComponent<
	{ Status: GameStatus; Details: PointDetails },
	SmPopupHook,
	SmState
> {
	public Rendering(): h.JSX.Element {
		return (
			<div
				class="generalContainer absolute-center-middle-menu menu-container fit-content"
				style={`border:${this.props.Status === GameStatus.Victory ? 'gold' : 'crimson'} 5px solid`}
			>
				<TitleIcon Status={this.props.Status} />
				<Column>
					<AnimatedProgress Width={80} MaxWidth={0} Details={this.props.Details} />
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
							<Btn callBack={() => this.Hook.Retry()} color={ColorKind.Blue}>
								<Icon Value="fas fa-undo-alt" /> Retry
							</Btn>
						</Visible>
					</Line>
				</Column>
			</div>
		);
	}

	public GetDefaultHook(): SmPopupHook {
		return new SmPopupHook(useState(new SmState(this.props.Status)));
	}
}
