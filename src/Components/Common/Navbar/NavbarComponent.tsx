import { h, Component } from 'preact';
import { AudioContent } from '../../../Core/Framework/AudioArchiver';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { Factory, FactoryKey } from '../../../Factory';
import { IModelService } from '../../../Services/Model/IModelService';
import { Model } from '../../../Services/Model/Model';
import { ISoundService } from '../../../Services/Sound/ISoundService';
import { ColorKind } from '../Button/Stylish/ColorKind';
import SmActiveButtonComponent from '../Button/Stylish/SmActiveButtonComponent';
import SmButtonComponent from '../Button/Stylish/SmButtonComponent';
import SmUploadButtonComponent from '../Button/Stylish/SmUploadButtonComponent';
import Icon from '../Icon/IconComponent';

export default class NavbarComponent extends Component<any, any> {
	private _soundService: ISoundService;
	constructor() {
		super();
		this._soundService = Factory.Load<ISoundService>(FactoryKey.Sound);
	}

	private Upload(e: any): void {
		var reader = new FileReader();
		reader.readAsText(e.target.files[0], 'UTF-8');
		reader.onload = (ev: ProgressEvent<FileReader>) => {
			const context = JSON.parse(ev.target.result as string);
			let model = new Model();
			if (this.IsModel(context)) {
				model = context as Model;
			}
			Factory.Load<IModelService>(FactoryKey.Model).SetModel(model);
		};
	}

	private IsModel(e: any) {
		return Object.keys(new Model()).every((key) => !isNullOrUndefined(e[key]));
	}

	private Save(): void {
		const data = Factory.Load<IModelService>(FactoryKey.Model).GetModel();
		const url = document.createElement('a');
		const file = new Blob([ JSON.stringify(data) ], { type: 'application/json' });
		url.href = URL.createObjectURL(file);
		url.download = `save.json`;
		url.click();
		URL.revokeObjectURL(url.href);
	}

	render() {
		return (
			<div>
				<nav class="navbar navbar-dark dark">
					<div class="d-flex justify-content-start">
						<div class="icon-badge" style="margin-right:5px" />
						<div class="progress" style="width:50px;height:25px; border: 4px solid rgb(198, 198, 198)">
							<div
								class="progress-bar bg-danger"
								role="progressbar"
								style={'width:' + 30 + '%'}
								aria-valuenow={30}
								aria-valuemin="0"
								aria-valuemax="100"
							/>
						</div>
						<div class="icon2-badge" style="margin-right:5px;margin-left:5px" />
						<div class="progress" style="width:50px;height:25px; border: 4px solid rgb(198, 198, 198)">
							<div
								class="progress-bar bg-dark"
								role="progressbar"
								style={'width:' + 70 + '%'}
								aria-valuenow={30}
								aria-valuemin="0"
								aria-valuemax="100"
							/>
						</div>
					</div>
					<div class="d-flex justify-content-start">
						<SmActiveButtonComponent
							left={<Icon Value={'fas fa-volume-mute'} />}
							right={<Icon Value={'fas fa-volume-up'} />}
							leftColor={ColorKind.Black}
							rightColor={ColorKind.Yellow}
							callBack={() => {
								if (this._soundService.IsMute()) {
									this._soundService.On();
									this._soundService.PlayAgain(AudioContent.menuMusic);
								} else {
									this._soundService.Off();
									this._soundService.Pause(AudioContent.menuMusic);
								}
								this.setState({});
							}}
							isActive={this._soundService.IsMute()}
						/>
						<div class="space-out" />
						<SmUploadButtonComponent
							callBack={(e: any) => this.Upload(e)}
							color={ColorKind.Red}
							icon={'fas fa-file-download'}
						/>
						<div class="space-out" />
						<SmButtonComponent
							callBack={() => {
								this.Save();
							}}
							color={ColorKind.Blue}
						>
							<Icon Value={'far fa-save'} />
						</SmButtonComponent>
					</div>
				</nav>
				{this.props.children}
			</div>
		);
	}
}
