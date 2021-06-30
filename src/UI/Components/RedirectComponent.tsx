import { Component } from 'preact';
import { route } from 'preact-router';
import { SpriteProvider } from '../../Core/Framework/SpriteProvider';

export default class Redirect extends Component<any, any> {
	componentWillMount() {
		// if (!SpriteProvider.IsLoaded()) {
		// 	route('{{sub_path}}Loading', true);
		// }
	}

	render() {
		return this.props.children;
	}
}
