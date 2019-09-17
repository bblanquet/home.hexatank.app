
import { h, render } from 'preact';
import HomeComponent from './Source/Menu/Home/HomeComponent'; 
import CanvasComponent from './Source/Menu/Canvas/CanvasComponent'; 
import OffHostComponent from './Source/Menu/Network/Host/Off/OffHostComponent'; 
import OnHostComponent from './Source/Menu/Network/Host/On/OnHostComponent'; 
import OffJoinComponent from './Source/Menu/Network/Join/Off/OffJoinComponent'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';
import './Source/Menu/Common/CommonStyle.css'

render(
    (<Router>
        <HomeComponent path="/Home" />
        <CanvasComponent path="/Canvas" default/>
        <OffHostComponent path="/OffHost"/>
        <OnHostComponent path="/OnHost/:serverName/:playerName/:isAdmin"/>
        <OffJoinComponent path="/OffJoin"/>
    </Router>)
    , document.querySelector('#app'));