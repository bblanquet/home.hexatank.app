import { JSX, h } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import GameCanvas from '../Components/GameCanvas';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Common/Struct/Visible';
import { HookedComponent } from '../Hooks/HookedComponent';
import { FireHook } from '../Hooks/FireHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import MenuSwitcher from '../Components/Canvas/MenuSwitcher';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import Switch from '../Common/Struct/Switch';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { GenericGameHook } from '../Hooks/GenericGameHook';
import { FireV2Context } from '../../Core/Framework/Context/FireV2Context';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';

export default class FireV2Screen extends HookedComponent<
	{},
	GenericGameHook<FireBlueprint, FireV2Context>,
	RuntimeState
> {
	public GetDefaultHook(): GenericGameHook<FireBlueprint, FireV2Context> {
		return new GenericGameHook<FireBlueprint, FireV2Context>(useState(FireHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Visible
					isVisible={
						this.Hook.State.GameStatus !== GameStatus.Pending &&
						!isNullOrUndefined(this.Hook.State.StatusDetails)
					}
				>
					<SmPopup Status={this.Hook.State.GameStatus} Details={this.Hook.State.StatusDetails} />
				</Visible>
				<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
					<Visible isVisible={!this.Hook.State.HasMenu}>
						<div style="position: fixed;">
							<button
								type="button"
								class="btn btn-dark small-space space-out fill-option"
								onClick={() => this.Hook.SetMenu()}
							/>
						</div>
						<Switch
							isLeft={isNullOrUndefined(this.Hook.State.Item)}
							left={
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
							}
							right={
								<MenuSwitcher
									TankRequestCount={this.Hook.State.TankRequestCount}
									TruckRequestCount={this.Hook.State.TruckRequestCount}
									VehicleCount={this.Hook.GetVehicleCount()}
									ReactorCount={this.Hook.GetReactor()}
									Item={this.Hook.State.Item}
									OnClick={(e) => this.Hook.SendContext(e)}
									HasMultiMenu={this.Hook.State.IsMultiMenuVisible}
									Fields={this.Hook.GetFields()}
								/>
							}
						/>
					</Visible>
					<Visible isVisible={this.Hook.State.HasMenu}>
						<OptionPopup
							Status={this.Hook.State.GameStatus}
							Resume={() => this.Hook.SetMenu()}
							Quit={() => this.Hook.Stop(false)}
						/>
					</Visible>
				</Visible>
				<GameCanvas Center={this.Hook.GetCenter()} OnRefresh={this.Hook.OnRefresh} />
			</Redirect>
		);
	}
}
