import { Container } from 'inversify';
import { AppService } from './Services/App/AppService';
import { IAppService } from './Services/App/IAppService';
import { TYPES } from './types';
import 'reflect-metadata';

const Resolver = new Container();
Resolver.bind<IAppService>(TYPES.AppService).to(AppService).inSingletonScope();
export { Resolver };
