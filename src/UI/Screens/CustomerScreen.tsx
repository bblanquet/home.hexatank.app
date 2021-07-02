import axios from 'axios';
import { Component, h } from 'preact';
import Navbar from '../Components/Navbar';
import Redirect from '../Components/Redirect';

export default class CustomerScreen extends Component<any, any> {
	componentDidMount() {
		axios
			.get('{{p2p_url}}/server/exception/list')
			.then(function(response) {
				// handle success
				console.log(response);
			})
			.catch(function(error) {
				// handle error
				console.log(error);
			})
			.then(function() {
				// always executed
			});
	}

	render() {
		return (
			<Redirect>
				<Navbar>allo</Navbar>
			</Redirect>
		);
	}
}
