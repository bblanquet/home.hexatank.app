import { Versionning } from '../../Components/Model/Versionning';

export interface IVersionService {
	GetVersionNumber(): string;
	GetVersions(): Versionning[];
}
