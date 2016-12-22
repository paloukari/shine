import { Component, Input, OnChanges, SimpleChange, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Transaction } from '../parser/transaction/transaction';
import { XmlDocument } from '../parser/transaction/xml-document';


@Component({
   moduleId: module.id,
   selector: 'xml-document-renderer',
   changeDetection: ChangeDetectionStrategy.OnPush,
   templateUrl: 'xml-document-renderer.component.html',
})
export class XmlDocumentRendererComponent implements OnChanges {

   @Input()
   document: XmlDocument;

   transaction: Transaction;

   constructor(private ref: ChangeDetectorRef) {
   }

   markForCheck() {
      this.ref.markForCheck();
   }

   ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      if (changes && changes['document'] && changes['document'].currentValue) {
         this.transaction = (changes['document'].currentValue as XmlDocument).trn;
         this.ref.markForCheck();
      }
   }

}
