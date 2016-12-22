import { ApplicationRef, Component, ChangeDetectorRef, Injectable } from '@angular/core';
import { TransactionHandler } from './services/transaction-handler.service';

import { XmlDocument } from './parser/transaction/xml-document';

import './shared/rxjs-operators';

@Injectable()
@Component({
   moduleId: module.id,
   selector: 'boot-app',
   templateUrl: 'app.component.html',
})
export class AppComponent {

   public toastOptions = {
      timeOut: 2000,
      lastOnBottom: true,
      clickToClose: true,
      maxLength: 0,
      maxStack: 7,
      showProgressBar: true,
      pauseOnHover: true,
      preventDuplicates: false,
      // preventLastDuplicates: 'visible',
      rtl: false,
      animate: 'scale',
      position: ['right', 'bottom']
   };

   searchTerm = '0007';

   title = 'Shine 3.0';

   document: XmlDocument = null;

   constructor(private ApplicationRef: ApplicationRef, private ref: ChangeDetectorRef,
      private _transactionHandler: TransactionHandler
   ) {
      this._transactionHandler.documentStream.subscribe(e => {
         this.document = e;
         this.ref.markForCheck();
      }, error => {
         console.error(error);
      });

      // TODO: remove this
      this.search(this.searchTerm);
   }


   inputChanged(event: Event) {
      this.search((<any>event.target).value);
   }

   search(term: string) {
      this._transactionHandler.search(term);
   }


}
