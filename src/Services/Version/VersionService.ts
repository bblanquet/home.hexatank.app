import { Versionning } from '../../Components/Model/Versionning';
import { IVersionService } from './IVersionService';

export class VersionService implements IVersionService {
	private _versions: Versionning[] = [
		new Versionning('0.8.2', [ 'stuffs' ], [ 'Marvin' ]),
		new Versionning(
			'0.8.14',
			[ 'fix hanging unit', 'fix and improve IA', 'improve online synchronisation #2' ],
			[ 'Doug' ]
		),
		new Versionning(
			'0.8.13',
			[
				'add self-automated collector',
				'disable fog of war',
				'change game speed',
				'make stages onLoaded',
				'fix some multiselection bug',
				'improve online synchronisation #1'
			],
			[ 'Doug', 'Marvin' ]
		)
	];

	GetVersions(): Versionning[] {
		return this._versions;
	}

	public GetVersionNumber(): string {
		return this._versions[0].Name;
	}
}
