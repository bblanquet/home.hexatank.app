import { h, render } from 'preact';
import HomeComponent from './Source/Menu/Home/HomeComponent'; 
import CanvasComponent from './Source/Menu/Canvas/CanvasComponent'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Router from 'preact-router';


render(
    (<Router>
        <CanvasComponent path="/Canvas" />
        <HomeComponent path="/Home" default/>
    </Router>)
    , document.querySelector('#app'));