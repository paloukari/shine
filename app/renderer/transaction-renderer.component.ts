import { Component, Input, OnChanges, SimpleChange, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Transaction } from '../parser/transaction/transaction';
import { Form } from '../parser/transaction/form';

import { DynamicFormModel } from '../dynamic/form/dynamic-form-model';

import { DynamicActionModel } from '../dynamic/action/dynamic-action-model';
import { EndpointType } from '../shared/endpoint-type';
import { Notification } from '../shared/notification';
import { Subscription } from 'rxjs';
import { XmlDocumentRendererComponent } from './xml-document-renderer.component';


@Component({
   moduleId: module.id,
   selector: 'transaction-renderer',
   changeDetection: ChangeDetectionStrategy.OnPush,
   templateUrl: 'transaction-renderer.component.html',
})
export class TransactionRendererComponent implements OnChanges {

   @Input()
   transaction: Transaction;

   form: DynamicFormModel;
   warning: Notification;

   notify: (input?: DynamicActionModel) => void;
   private subscription: Subscription;
   constructor(private _app: XmlDocumentRendererComponent, private ref: ChangeDetectorRef) {

   }

   markForCheck() {
      this.ref.markForCheck();
      this._app.markForCheck();
   }
   ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      if (changes && changes['transaction'] && changes['transaction'].currentValue) {

         if (this.subscription) {
            this.subscription.unsubscribe();
         }
         this.subscription = this.transaction.getEndpointData(EndpointType.Form).debounceTime(50).subscribe((e) => {
            if (this.form) {
               this.form.dispose();
            }
            this.form = new DynamicFormModel(new Form(e));
            this.ref.markForCheck();
         });

         this.notify = (a) => this.transaction.onNotify(a);
         this.notify(null);

         this.ref.markForCheck();
      }
   }

   onNotify(event: DynamicActionModel): void {

      if (!event.form || !event.formModel || !(event.controlModel || event.keyboardEvent)) {
         throw Error('event not properly prepared');
      }

      this.notify(event);
   }

}
