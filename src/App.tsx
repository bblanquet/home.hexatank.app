import './Register';
import { h, render } from 'preact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './UI/Style/Common.scss';
import './UI/Style/CircularMenu.css';
import './UI/Style/IconStyle.css';
import './UI/Style/Animation.css';
import './UI/Style/BtnStyle.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { GameStatus } from './Core/Framework/GameStatus';
import { DeltaCurves, Logs } from '../test/Variables';
import { JsonRecordContent } from './Core/Framework/Record/Model/JsonRecordContent';
import HomeScreen from './UI/Screens/HomeScreen';
import LoadingScreen from './UI/Screens/LoadingScreen';
import ErrorScreen from './UI/Screens/ErrorScreen';
import SinglePlayerScreen from './UI/Screens/SinglePlayerScreen';
import RedScreen from './UI/Screens/RedScreen';
import TrainingScreen from './UI/Screens/TrainingScreen';
import BlueScreen from './UI/Screens/BlueScreen';
import GameScreen from './UI/Screens/GameScreen';
import BadgeScreen from './UI/Screens/BadgeScreen';
import PlayerScreen from './UI/Screens/Record/PlayerScreen';
import CreatingHostScreen from './UI/Screens/Network/Creating/CreatingHostComponent';
import LobbyScreen from './UI/Screens/Network/Lobby/LobbyComponent';
import CamouflageScreen from './UI/Screens/CamouflageScreen';
import ProfilScreen from './UI/Screens/Profil/ProfilScreen';
import DiamondScreen from './UI/Screens/DiamondScreen';
import FireScreen from './UI/Screens/FireScreen';
import GuestScreen from './UI/Screens/Network/Guest/GuestComponent';
import RecordScreen from './UI/Screens/Record/PlayerScreen';
import LoadingPlayers from './UI/Screens/Network/Lobby/Players/LoadingPlayersComponent';
import PopupComponent from './UI/Components/PopupComponent';
import SmPopupComponent from './UI/Components/SmPopupComponent';
import ComparisonScreen from './UI/Screens/Comparer/ComparisonScreen';
import LogComponent from './UI/Screens/Comparer/LogComponent';

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
			<PopupComponent
				path="{{sub_path}}Popup"
				points={30}
				curves={DeltaCurves()}
				status={GameStatus.Victory}
				context={new JsonRecordContent()}
			/>
			<SmPopupComponent path="{{sub_path}}SmPopup" points={10} status={GameStatus.Victory} />
			<ComparisonScreen path="{{sub_path}}Comparison" />
			<LogComponent path="{{sub_path}}Log" Messages={Logs()} />
		</Router>
	);
};

render(<App />, document.body);
