import 'preact/debug';
import './Register';
import { h, render } from 'preact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Ui/Style/Common.scss';
import './Ui/Style/CircularMenu.css';
import './Ui/Style/IconStyle.css';
import './Ui/Style/Animation.css';
import './Ui/Style/BtnStyle.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { GameStatus } from './Core/Framework/GameStatus';
import { DeltaCurves, Logs } from '../test/Variables';
import { JsonRecordContent } from './Core/Framework/Record/Model/JsonRecordContent';
import HomeScreen from './Ui/Screens/HomeScreen';
import LoadingScreen from './Ui/Screens/LoadingScreen';
import ErrorScreen from './Ui/Screens/ErrorScreen';
import SinglePlayerScreen from './Ui/Screens/SinglePlayerScreen';
import RedScreen from './Ui/Screens/RedScreen';
import TrainingScreen from './Ui/Screens/TrainingScreen';
import BlueScreen from './Ui/Screens/BlueScreen';
import GameScreen from './Ui/Screens/GameScreen';
import BadgeScreen from './Ui/Screens/BadgeScreen';
import PlayerScreen from './Ui/Screens/Record/PlayerScreen';
import CreatingHostScreen from './Ui/Screens/CreateHostScreen';
import LobbyScreen from './Ui/Screens/LobbyScreen';
import CamouflageScreen from './Ui/Screens/CamouflageScreen';
import ProfilScreen from './Ui/Screens/Profil/ProfilScreen';
import DiamondScreen from './Ui/Screens/DiamondScreen';
import FireScreen from './Ui/Screens/FireScreen';
import GuestScreen from './Ui/Screens/GuestScreen';
import RecordScreen from './Ui/Screens/Record/PlayerScreen';
import LoadingPlayers from './Ui/Components/LoadingPlayers';
import Popup from './Ui/Components/Popup';
import SmPopup from './Ui/Components/SmPopup';
import ComparisonScreen from './Ui/Screens/Comparer/ComparisonScreen';
import LogComponent from './Ui/Screens/Comparer/LogComponent';
import CustomerScreen from './Ui/Screens/CustomerScreen';
import Notification from './Ui/Components/Notification';
import { LiteEvent } from './Utils/Events/LiteEvent';
import { NotificationState } from './Ui/Model/NotificationState';

const App = (e: any) => {
	return (
		<Router>
			<HomeScreen path="{{sub_path}}Home" />
			<LoadingScreen path="{{sub_path}}Loading" default />
			<ErrorScreen path="{{sub_path}}Error" />
			<SinglePlayerScreen path="{{sub_path}}SinglePlayer" />
			<RedScreen path="{{sub_path}}Red" />
			<TrainingScreen path="{{sub_path}}Training" />
			<BlueScreen path="{{sub_path}}Blue" />
			<GameScreen path="{{sub_path}}Canvas" />
			<BadgeScreen path="{{sub_path}}Badge" />
			<PlayerScreen path="{{sub_path}}Player" />
			<CreatingHostScreen path="{{sub_path}}CreatingHost" />
			<LobbyScreen path="{{sub_path}}Lobby" />
			<CamouflageScreen path="{{sub_path}}Camouflage" />
			<DiamondScreen path="{{sub_path}}Diamond" />
			<FireScreen path="{{sub_path}}Fire" />
			<ProfilScreen path="{{sub_path}}Profil" />
			<GuestScreen path="{{sub_path}}OffJoin" />
			<RecordScreen path="{{sub_path}}Record" />
			<LoadingPlayers path="{{sub_path}}Launching" />
			<Popup
				path="{{sub_path}}Popup"
				points={30}
				curves={DeltaCurves()}
				status={GameStatus.Victory}
				context={new JsonRecordContent()}
			/>
			<SmPopup path="{{sub_path}}SmPopup" points={10} status={GameStatus.Victory} />
			<ComparisonScreen path="{{sub_path}}Comparison" />
			<CustomerScreen path="{{sub_path}}Customer" />
			<LogComponent path="{{sub_path}}Log" Messages={Logs()} />
			<Notification path="{{sub_path}}Log" OnNotification={new LiteEvent<NotificationState>()} />
		</Router>
	);
};

render(<App />, document.body);
