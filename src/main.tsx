import './Register';
import { h, render } from 'preact';
import HomeComponent from './Components/Home/HomeComponent';
import TrainingComponent from './Components/Campaign/TrainingComponent';
import ErrorComponent from './Components/Error/ErrorComponent';
import SinglePlayerComponent from './Components/SinglePlayer/SinglePlayerComponent';
import GameCanvasComponent from './Components/Canvas/Game/GameCanvasComponent';
import RecordCanvasComponent from './Components/Canvas/Record/RecordCanvasComponent';
import CamouflageComponent from './Components/Canvas/Camouflage/CamouflageComponent';
import DiamondComponent from './Components/Canvas/Diamond/DiamondComponent';
import PowerComponent from './Components/Canvas/Power/PowerComponent';
import RedCampaignComponent from './Components/Campaign/RedCampaignComponent';
import BlueCampaignComponent from './Components/Campaign/BlueCampaignComponent';
import BadgeComponent from './Components/Badge/BagdeComponent';
import GuestComponent from './Components/Network/Guest/GuestComponent';
import CreatingHostComponent from './Components/Network/Creating/CreatingHostComponent';
import LobbyComponent from './Components/Network/Lobby/LobbyComponent';
import LoadingPlayers from './Components/Network/Lobby/Players/LoadingPlayersComponent';
import LoadingComponent from './Components/Loading/LoadingComponent';
import LineComparisonComponent from './Components/Comparer/LineComparisonComponent';
import BarComparisonComponent from './Components/Comparer/BarComparisonComponent';
import SmPopupComponent from './Components/SmPopup/SmPopupComponent';
import PopupComponent from './Components/Popup/PopupComponent';
import RecordComponent from './Components/Record/RecordComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Components/Style/CommonStyle.scss';
import './Components/Style/CircularMenu.css';
import './Components/Style/IconStyle.css';
import './Components/Style/BtnStyle.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { GameStatus } from './Core/Framework/GameStatus';
import { Context } from './Context';
import { RecordAny } from './Core/Framework/Record/Model/RecordAny';

const App = (e: any) => {
	return (
		<Router>
			<HomeComponent path="{{sub_path}}Home" />
			<LoadingComponent path="{{sub_path}}Loading" default />
			<ErrorComponent path="{{sub_path}}Error" />
			<SinglePlayerComponent path="{{sub_path}}SinglePlayer" />
			<RedCampaignComponent path="{{sub_path}}Campaign" />
			<TrainingComponent path="{{sub_path}}Training" />
			<BlueCampaignComponent path="{{sub_path}}BlueCampaignComponent" />
			<GameCanvasComponent path="{{sub_path}}Canvas" />
			<BadgeComponent path="{{sub_path}}Badge" />
			<RecordCanvasComponent path="{{sub_path}}RecordCanvas" />
			<CreatingHostComponent path="{{sub_path}}CreatingHost" />
			<LobbyComponent path="{{sub_path}}Lobby" />
			<CamouflageComponent path="{{sub_path}}Camouflage" />
			<DiamondComponent path="{{sub_path}}Diamond" />
			<PowerComponent path="{{sub_path}}Power" />
			<GuestComponent path="{{sub_path}}OffJoin" />
			<RecordComponent path="{{sub_path}}Record" />
			<LoadingPlayers path="{{sub_path}}Launching" />
			<PopupComponent
				path="{{sub_path}}Popup"
				points={30}
				curves={Context()}
				status={GameStatus.Victory}
				context={new RecordAny()}
			/>
			<SmPopupComponent path="{{sub_path}}SmPopup" points={10} status={GameStatus.Victory} />
			<LineComparisonComponent path="{{sub_path}}LineComparison" />
			<BarComparisonComponent path="{{sub_path}}BarComparison" />
		</Router>
	);
};

render(<App />, document.body);
