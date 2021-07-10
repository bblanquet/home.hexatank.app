import { JSX, h } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { Cell } from '../../Core/Items/Cell/Cell';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import TimerComponent from '../Common/Timer/TimerComponent';
import GameCanvas from '../Components/GameCanvas';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Components/Visible';
import { HookedComponent } from '../Hooks/HookedComponent';
import { DiamondHook } from '../Hooks/DiamondHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import MenuSwitcher from '../Components/Canvas/MenuSwitcher';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import Switch from '../Components/Switch';

export default class DiamondScreen extends HookedComponent<{}, DiamondHook, RuntimeState> {
	public GetDefaultHook() {
		return new DiamondHook(useState(DiamondHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Visible isVisible={this.Hook.State.GameStatus !== GameStatus.Pending}>
					<SmPopup status={this.Hook.State.GameStatus} />
				</Visible>
				<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
					<Visible isVisible={!this.Hook.State.HasMenu}>
						<div style="position: fixed;">
							<button
								type="button"
								class="btn btn-dark small-space space-out fill-option"
								onClick={() => this.Hook.SetMenu()}
							/>
							<button type="button" class="btn btn-dark space-out">
								<Visible isVisible={this.Hook.State.HasWarning}>
									<span class="fill-noMoney badge badge-warning very-small-space middle very-small-right-margin blink_me">
										{' '}
									</span>
								</Visible>
								{this.Hook.State.Amount.toFixed(2)}
								<span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin">
									{' '}
								</span>
							</button>
							<TimerComponent
								Duration={this.Hook.GetDuration()}
								OnTimerDone={this.Hook.OnTimerDone()}
								isPause={this.Hook.State.HasMenu}
							/>
						</div>
						<Switch
							isVisible={isNullOrUndefined(this.Hook.State.Item)}
							left={
								<div class="right-bottom-menu">
									<ActiveRightBottomCornerButton
										isActive={this.Hook.IsListeningVehicle()}
										callBack={() => this.Hook.SendContext(new MultiTankMenuItem())}
										logo="fill-tank-multi-cell"
									/>
									<ActiveRightBottomCornerButton
										isActive={this.Hook.IsListeningCell()}
										callBack={() => this.Hook.SendContext(new MultiCellMenuItem())}
										logo="fill-mult-cell"
									/>
								</div>
							}
							right={
								<MenuSwitcher
									IsSettingPatrol={this.Hook.State.IsSettingPatrol}
									TankRequestCount={this.Hook.State.TankRequestCount}
									TruckRequestCount={this.Hook.State.TruckRequestCount}
									VehicleCount={this.Hook.GetVehicleCount()}
									ReactorCount={this.Hook.GetReactor()}
									Item={this.Hook.State.Item}
									callback={(e) => this.Hook.SendContext(e)}
									HasMultiMenu={this.Hook.State.IsMultiMenuVisible}
									IsCovered={this.Hook.State.Item instanceof Cell ? this.Hook.IsCovered() : true}
								/>
							}
						/>
					</Visible>
					<Visible isVisible={this.Hook.State.HasMenu}>
						<OptionPopup
							Status={this.Hook.State.GameStatus}
							Resume={() => this.Hook.SetMenu()}
							Quit={() => this.Hook.Quit()}
						/>
					</Visible>
				</Visible>
				<GameCanvas middle={this.Hook.GetMiddle()} />
			</Redirect>
		);
	}
}
