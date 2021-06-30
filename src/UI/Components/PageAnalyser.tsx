import { Component } from 'preact';
import { Singletons, SingletonKey } from '../../Singletons';
import { IAnalyzeService } from '../../Services/Analyse/IAnalyzeService';

export default class PageAnalyser extends Component<any, any> {
	private _analyzerService: IAnalyzeService;

	constructor() {
		super();
		this._analyzerService = Singletons.Load<IAnalyzeService>(SingletonKey.Analyze);
	}

	componentDidMount() {
		if (this.props) {
			this._analyzerService.Page();
		}
	}

	render() {
		return this.props.children;
	}
}
