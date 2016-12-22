import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { TransactionRendererComponent } from './renderer/transaction-renderer.component';
import { XmlDocumentRendererComponent } from './renderer/xml-document-renderer.component';
import { DynamicFormComponent } from './dynamic/form/dynamic-form.component';
import { DynamicControlComponent } from './dynamic/control/dynamic-control.component';
import { StatusMessageComponent } from './dynamic/control/status-message.component';
import { Logger } from './services/logger.service';
import { TransactionHandler } from './services/transaction-handler.service';
import { XmlProcessor } from './services/xml-processor';
import { TransactionAPI } from './services/transaction-API.service';
import { MultipleDirective } from './shared/directives/multiple.directive';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { FeedComponent, DashboardComponent, FeedService } from './shared/feed.component';

import { MaterialModule } from '@angular/material';
import { DynamicTableComponent } from './dynamic/control/dynamic-table.component';
import { HotTable } from './dynamic/control/Handsontable';

import { ConfigService } from './services/config.service';


@NgModule({
   imports: [MaterialModule.forRoot(),

      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      SimpleNotificationsModule,
      PushNotificationsModule,
      HttpModule,
      JsonpModule],
   declarations: [HotTable, DynamicTableComponent, AppComponent,
      TransactionRendererComponent,
      XmlDocumentRendererComponent,
      DynamicFormComponent,
      DynamicControlComponent,
      MultipleDirective,
      StatusMessageComponent,
      FeedComponent,
      DashboardComponent
   ],
   bootstrap: [AppComponent],
   providers: [Logger,
      TransactionHandler,
      TransactionAPI,
      XmlProcessor,
      FeedService,
      ConfigService,
      {
         provide: APP_INITIALIZER,
         useFactory: (config: ConfigService) => () => config.load(),
         deps: [ConfigService],
         multi: true
      }
   ]
})

export class AppModule { }
