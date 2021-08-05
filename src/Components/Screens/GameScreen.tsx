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
import { HookedComponent } from '../Hooks/HookedComponent';
import { GameHook } from '../Hooks/GameHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';

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
						isLeft={this.Hook.State.IsSynchronising}
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
								isLeft={this.Hook.State.IsSettingMenuVisible}
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
													isActive={this.Hook.State.SelectionKind === SelectionKind.Vehicle}
													callBack={() => this.Hook.SendContext(new MultiTankMenuItem())}
													logo="fill-tank-multi-cell"
												/>
												<ActiveRightBottomCornerButton
													isActive={this.Hook.State.SelectionKind === SelectionKind.Cell}
													callBack={() => this.Hook.SendContext(new MultiCellMenuItem())}
													logo="fill-mult-cell"
												/>
											</div>
										</Visible>
										<Visible isVisible={!isNullOrUndefined(this.Hook.State.Item)}>
											<MenuSwitcher
												TankRequestCount={this.Hook.State.TankRequestCount}
												TruckRequestCount={this.Hook.State.TruckRequestCount}
												VehicleCount={this.Hook.GetVehicleCount()}
												ReactorCount={this.Hook.GetReactor()}
												Item={this.Hook.State.Item}
												OnClick={(e) => this.Hook.SendContext(e)}
												HasMultiMenu={this.Hook.State.IsMultiMenuVisible}
												FieldBtns={this.Hook.GetFieldBtns()}
												Btns={this.Hook.GetBtns()}
											/>
										</Visible>
									</span>
								}
							/>
						}
					/>
				</Visible>
				<GameCanvas Center={this.Hook.GetCenter()} OnRefresh={this.Hook.OnRefresh} />
			</Redirect>
		);
	}
}
