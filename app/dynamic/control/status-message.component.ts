import { Component, Input, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import 'rxjs';


@Component({
   moduleId: module.id,
   changeDetection: ChangeDetectionStrategy.OnPush,
   selector: 'status-message',
   templateUrl: 'status-message.component.html'
})

export class StatusMessageComponent implements OnChanges {
   @Input()
   message: string;

   constructor(private _notificationsService: NotificationsService) {
      this.message = 'test';
   }

   ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      if (changes && changes['message'] && changes['message'].currentValue) {
         this.message = (changes['message'].currentValue as string);

         if (this.message) {
            this._notificationsService.error('Problem!', this.message);
         }
      }
   }
}
