import './Register';
import { h, render } from 'preact';
import HomeComponent from './Components/Home/HomeComponent';
import SinglePlayerComponent from './Components/SinglePlayer/SinglePlayerComponent';
import GameCanvasComponent from './Components/Canvas/Game/GameCanvasComponent';
import RecordCanvasComponent from './Components/Canvas/Record/RecordCanvasComponent';
import CampaignComponent from './Components/Campaign/CampaignComponent';
import BlueCampaignComponent from './Components/Campaign/BlueCampaignComponent';
import BadgeComponent from './Components/Badge/BagdeComponent';
import GuestComponent from './Components/Network/Guest/GuestComponent';
import CreatingHostComponent from './Components/Network/Creating/CreatingHostComponent';
import HostingComponent from './Components/Network/Host/HostingComponent';
import LoadingComponent from './Components/Loading/LoadingComponent';
import ComparerComponent from './Components/Comparer/ComparerComponent';
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
//check
const Main = (e: any) => {
	return (
		<Router>
			<HomeComponent path="/Home" />
			<SinglePlayerComponent path="/SinglePlayer" />
			<CampaignComponent path="/Campaign" />
			<BlueCampaignComponent path="/BlueCampaignComponent" />
			<GameCanvasComponent path="/Canvas" />
			<BadgeComponent path="/Badge" />
			<RecordCanvasComponent path="/RecordCanvas" />
			<CreatingHostComponent path="/CreatingHost" />
			<HostingComponent path="/Hosting" />
			<GuestComponent path="/OffJoin" />
			<RecordComponent path="/Playback" />
			<LoadingComponent path="/Loading" default />
			<PopupComponent path="/Popup" curves={Context()} status={GameStatus.Won} context={{ a: 1 }} />
			<ComparerComponent path="/Comparer" />
		</Router>
	);
};

render(<Main />, document.body);
