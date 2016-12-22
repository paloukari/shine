import './shared/rxjs-operators';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Injector } from '@angular/core';
import { AppModule } from './app.module';

export let rootInjector: Injector;
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule).then(componentRef => rootInjector = componentRef.injector);
