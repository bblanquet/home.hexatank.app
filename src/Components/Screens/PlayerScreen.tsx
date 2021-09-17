import { JSX, h } from 'preact';
import RangeComponent from '../Common/Range/RangeComponent';
import UnitMenuComponent from '../Components/UnitMenuComponent';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import GameCanvas from '../Components/GameCanvas';
import Icon from '../Common/Icon/IconComponent';
import Body from '../Common/Struct/Body';
import Navbar from '../Common/Struct/Navbar';
import Visible from '../Common/Struct/Visible';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmActiveBtn from '../Common/Button/Stylish/SmActiveBtn';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Switch from '../Common/Struct/Switch';
import LogComponent from '../Components/LogComponent';
import { HookedComponent } from '../Framework/HookedComponent';
import { PlayerState } from '../Model/PlayerState';
import { PlayerHook } from '../Hooks/PlayerHook';
import { useState } from 'preact/hooks';

export default class PlayerScreen extends HookedComponent<{}, PlayerHook, PlayerState> {
	public GetDefaultHook(): PlayerHook {
		return new PlayerHook(useState(PlayerHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Switch
				isLeft={this.Hook.State.IsLog}
				left={
					<Body
						noScrollbar={!this.Hook.State.IsLog}
						header={
							<span>
								<Navbar>
									{this.Button(false, 'far fa-map')}
									{this.Button(true, 'fas fa-stream')}
									<SmBtn Color={ColorKind.Black} OnClick={() => this.Hook.SetMenu()}>
										<Icon Value="fas fa-undo-alt" />
									</SmBtn>
								</Navbar>
								<div class="notification">{this.Hook.GetRecord().Title}</div>
							</span>
						}
						content={<LogComponent Messages={this.Hook.GetRecord().Messages} />}
						footer={<div class="navbar nav-inner" />}
					/>
				}
				right={
					<Body
						noScrollbar={!this.Hook.State.IsLog}
						header={
							<span>
								<Navbar>
									{this.Button(false, 'far fa-map')}
									{this.Button(true, 'fas fa-stream')}
									<SmBtn Color={ColorKind.Black} OnClick={() => this.Hook.SetMenu()}>
										<Icon Value="fas fa-undo-alt" />
									</SmBtn>
								</Navbar>
								<div class="notification">{this.Hook.GetRecord().Title}</div>
							</span>
						}
						content={
							<span>
								<GameCanvas
									Center={this.Hook.GetCenter()}
									OnRefresh={this.Hook.OnRefresh}
									uncollect={true}
								/>
								<Visible
									isVisible={this.Hook.State.Item !== null && this.Hook.State.Item !== undefined}
								>
									<UnitMenuComponent Vehicle={this.Hook.State.Item as Vehicle} />
								</Visible>
							</span>
						}
						footer={
							<RangeComponent
								dataSet={this.Hook.GetRecord().Dates}
								onChange={(e: number) => this.Hook.HandleRangeChanged(e)}
							/>
						}
					/>
				}
			/>
		);
	}

	private Button(state: boolean, icon: string) {
		return (
			<SmActiveBtn
				isActive={this.Hook.State.IsLog === state}
				leftColor={ColorKind.Red}
				rightColor={ColorKind.Black}
				left={<Icon Value={icon} />}
				right={<Icon Value={icon} />}
				OnClick={() => this.Hook.ChangePage(state)}
			/>
		);
	}
}
