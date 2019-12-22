
import { h, render } from 'preact';
import HomeComponent from './Menu/Home/HomeComponent';     
import SinglePlayerComponent from './Menu/SinglePlayer/SinglePlayerComponent'; 
import CanvasComponent from './Menu/Canvas/CanvasComponent'; 
import OffHostComponent from './Menu/Network/Host/Off/OffHostComponent'; 
import OnHostComponent from './Menu/Network/Host/On/OnHostComponent'; 
import OffJoinComponent from './Menu/Network/Join/Off/OffJoinComponent'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Menu/Common/CommonStyle.css'

render(
    (<Router>
        <HomeComponent path="/Home" default/>
        <SinglePlayerComponent path="/SinglePlayer" />
        <CanvasComponent path="/Canvas"/>
        <OffHostComponent path="/OffHost"/>
        <OnHostComponent path="/OnHost/:serverName/:playerName/:isAdmin"/>
        <OffJoinComponent path="/OffJoin"/>
    </Router>)
    , document.querySelector('#app'));
