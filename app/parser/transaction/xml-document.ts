import { Transaction } from './transaction';
import { EndpointType } from '../../shared/endpoint-type';
import { XSLTEndpoint } from '../../parser/xslt-endpoint';
import { FormEndpoint } from '../../parser/form-endpoint';
import * as _ from 'lodash';

export class XmlDocument {
   _transaction: Transaction;

   constructor(public document: Document) {

      this._transaction = new Transaction(document.childNodes[0]);
      this._transaction.setEndpoint(new XSLTEndpoint(), EndpointType.Function);
      this._transaction.setEndpoint(new FormEndpoint(), EndpointType.Form);
   }
   public get trn(): Transaction {
      return this._transaction;
   }

   public applyFormUpdates(formUpdates: Node[]) {
      if (formUpdates) {
         formUpdates.forEach(formUpdate => {
            this.applyFromUpdate(formUpdate);
         });
      }
   }
   private applyFromUpdate(fromUpdate: Node) {
      while (fromUpdate.childNodes.length > 0) {
         let child = fromUpdate.childNodes[0];
         if (child) {
            this._transaction.appendChild(child);
         }
      }
   }
}
