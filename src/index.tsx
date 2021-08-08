import { h, render } from 'preact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Components/Style/Common.scss';
import './Components/Style/CircularMenu.css';
import './Components/Style/IconStyle.css';
import './Components/Style/Animation.css';
import './Components/Style/BtnStyle.css';
import './Components/Style/Progress.scss';
import 'flagpack/dist/flagpack.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { GameStatus } from './Core/Framework/GameStatus';
import { DeltaCurves, Logs } from '../test/Variables';
import { JsonRecordContent } from './Core/Framework/Record/Model/JsonRecordContent';
import HomeScreen from './Components/Screens/HomeScreen';
import MockScreen from './Components/Screens/MockScreen';
import LoadingScreen from './Components/Screens/LoadingScreen';
import ErrorScreen from './Components/Screens/ErrorScreen';
import SinglePlayerScreen from './Components/Screens/SingleScreen';
import RedScreen from './Components/Screens/RedScreen';
import RedGameScreen from './Components/Screens/RedGameScreen';
import BlueGameScreen from './Components/Screens/BlueGameScreen';
import GreenScreen from './Components/Screens/GreenScreen';
import BlueScreen from './Components/Screens/BlueScreen';
import GameScreen from './Components/Screens/GameScreen';
import BadgeScreen from './Components/Screens/BadgeScreen';
import PlayerScreen from './Components/Screens/PlayerScreen';
import HostScreen from './Components/Screens/HostScreen';
import LobbyScreen from './Components/Screens/LobbyScreen';
import CamouflageScreen from './Components/Screens/CamouflageScreen';
import ProfilScreen from './Components/Screens/ProfilScreen';
import DiamondScreen from './Components/Screens/DiamondScreen';
import MultipostScreen from './Components/Screens/MultipostScreen';
import FireScreen from './Components/Screens/FireScreen';
import OutpostScreen from './Components/Screens/OutpostScreen';
import GuestScreen from './Components/Screens/GuestScreen';
import RecordScreen from './Components/Screens/PlayerScreen';
import LoadingPlayers from './Components/Components/LoadingPlayers';
import Popup from './Components/Components/Popup';
import SmPopup from './Components/Components/SmPopup';
import ComparisonScreen from './Components/Screens/ComparisonScreen';
import LogComponent from './Components/Components/LogComponent';
import MonitorScreen from './Components/Screens/MonitorScreen';
import Notification from './Components/Components/Notification';
import { LiteEvent } from './Utils/Events/LiteEvent';
import { NotificationState } from './Components/Model/NotificationState';
import { PointDetails } from './Services/PlayerProfil/PointDetails';
import { Env } from './Utils/Env';
if (!Env.IsPrd()) {
	require('preact/debug');
}

const App = (e: any) => {
	return (
		<Router>
			<MockScreen path="{{sub_path}}Mock" />
			<HomeScreen path="{{sub_path}}Home" />
			<LoadingScreen path="{{sub_path}}Loading" default />
			<ErrorScreen path="{{sub_path}}Error" />
			<SinglePlayerScreen path="{{sub_path}}SinglePlayer" />
			<RedScreen path="{{sub_path}}Red" />
			<RedGameScreen path="{{sub_path}}RedGame" />
			<BlueGameScreen path="{{sub_path}}BlueGame" />
			<GreenScreen path="{{sub_path}}Green" />
			<BlueScreen path="{{sub_path}}Blue" />
			<GameScreen path="{{sub_path}}Canvas" />
			<BadgeScreen path="{{sub_path}}Badge" />
			<PlayerScreen path="{{sub_path}}Player" />
			<HostScreen path="{{sub_path}}Host" />
			<LobbyScreen path="{{sub_path}}Lobby" />
			<CamouflageScreen path="{{sub_path}}Camouflage" />
			<DiamondScreen path="{{sub_path}}Diamond" />
			<FireScreen path="{{sub_path}}Fire" />
			<MultipostScreen path="{{sub_path}}Multioutpost" />
			<OutpostScreen path="{{sub_path}}Outpost" />
			<ProfilScreen path="{{sub_path}}Profil" />
			<GuestScreen path="{{sub_path}}Guest" />
			<RecordScreen path="{{sub_path}}Record" />
			<LoadingPlayers path="{{sub_path}}Launching" />
			<Popup
				path="{{sub_path}}Popup"
				curves={DeltaCurves()}
				status={GameStatus.Defeat}
				Details={new PointDetails(30, 40)}
				context={new JsonRecordContent()}
			/>
			<SmPopup path="{{sub_path}}SmPopup" Status={GameStatus.Victory} Details={new PointDetails(30, 40)} />
			<ComparisonScreen path="{{sub_path}}Comparison" />
			<MonitorScreen path="{{sub_path}}Customer" />
			<LogComponent path="{{sub_path}}Log" Messages={Logs()} />
			<Notification path="{{sub_path}}Log" OnNotification={new LiteEvent<NotificationState>()} />
		</Router>
	);
};

render(<App />, document.body);
