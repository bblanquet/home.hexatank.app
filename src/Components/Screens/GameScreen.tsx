import { JSX, h } from 'preact';
import OnlinePlayersComponent from '../Components/Canvas/OnlinePlayersComponent';
import GameCanvas from '../Components/GameCanvas';
import OptionPopup from '../Components/OptionPopup';
import { GameStatus } from '../../Core/Framework/GameStatus';
import Popup from '../Components/Popup';
import Redirect from '../Components/Redirect';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import Visible from '../Common/Struct/Visible';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import MenuSwitcher from '../Components/Canvas/MenuSwitcher';
import SynchronizingComponent from '../Components/Canvas/SynchronizingComponent';
import Switch from '../Common/Struct/Switch';
import { Cell } from '../../Core/Items/Cell/Cell';
import { HookedComponent } from '../Hooks/HookedComponent';
import { GameHook } from '../Hooks/GameHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';

export default class GameScreen extends HookedComponent<{}, GameHook, RuntimeState> {
	public GetDefaultHook(): GameHook {
		return new GameHook(useState(GameHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<OnlinePlayersComponent OnlineService={this.Hook.GetOnlineManager()} />
				<Visible
					isVisible={
						this.Hook.State.GameStatus !== GameStatus.Pending &&
						!isNullOrUndefined(this.Hook.State.StatusDetails)
					}
				>
					<Popup
						status={this.Hook.State.GameStatus}
						curves={this.Hook.GetCurves()}
						context={this.Hook.GetRecord()}
						Details={this.Hook.State.StatusDetails}
					/>
				</Visible>
				<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
					<Switch
						isVisible={this.Hook.State.IsSynchronising}
						left={
							<SynchronizingComponent
								Timeout={this.Hook.Timeout}
								Quit={() => {
									this.Hook.Stop(false);
								}}
							/>
						}
						right={
							<Switch
								isVisible={this.Hook.State.IsSettingMenuVisible}
								left={
									<OptionPopup
										Status={this.Hook.State.GameStatus}
										Resume={() => this.Hook.SetMenu()}
										Quit={() => {
											this.Hook.Stop(false);
										}}
									/>
								}
								right={
									<span>
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
										</div>
										<Visible isVisible={isNullOrUndefined(this.Hook.State.Item)}>
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
										</Visible>
										<Visible isVisible={!isNullOrUndefined(this.Hook.State.Item)}>
											<MenuSwitcher
												IsSettingPatrol={this.Hook.State.IsSettingPatrol}
												TankRequestCount={this.Hook.State.TankRequestCount}
												TruckRequestCount={this.Hook.State.TruckRequestCount}
												VehicleCount={this.Hook.GetVehicleCount()}
												ReactorCount={this.Hook.GetReactor()}
												Item={this.Hook.State.Item}
												callback={(e) => this.Hook.SendContext(e)}
												HasMultiMenu={this.Hook.State.IsMultiMenuVisible}
												IsCovered={
													this.Hook.State.Item instanceof Cell ? this.Hook.IsCovered() : true
												}
											/>
										</Visible>
									</span>
								}
							/>
						}
					/>
				</Visible>
				<GameCanvas middle={this.Hook.GetMiddle()} />
			</Redirect>
		);
	}
}
