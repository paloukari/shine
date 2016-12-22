import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TransactionInfo } from './transaction-info';

@Injectable()
export class TransactionAPI {

   private _baseUrl = `http://${location.hostname}:${location.port}/api`;
   private _transactionsUrl = 'transactions';
   private _transactionFilesUrl = 'transactionFiles';

   constructor(private http: Http) { }

   // getTransactions(): Observable<TransactionFile[]> {
   //     return this.http.get(`${this._baseUrl}/${this._transactionsUrl}`)
   //         .map(this.extractData)
   //         .catch(this.handleError);
   // }

   getTransactionFile(filename: string): Observable<string> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(`${this._baseUrl}/${this._transactionFilesUrl}/${filename}`, options)
         .map(this.extractFile)
         .catch(this.handleError);
   }


   getTransaction(name: string): Observable<TransactionInfo> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(`${this._baseUrl}/${this._transactionsUrl}/${name}`, options)
         .map(this.extractTransactionInfo)
         .catch(this.handleError);
   }

   private extractTransactionInfo(res: Response): TransactionInfo {
      let body = res.json();
      return body as TransactionInfo;
   }
   private extractFile(res: Response) {
      let body = res.text();
      return body || {};
   }
   private handleError(error: Response | any) {
      // In a real world app, we might use a remote logging infrastructure
      let errMsg: string;
      if (error instanceof Response) {
         errMsg = `${error.status} - ${error.statusText || ''} ${error.text()}`;
      } else {
         errMsg = error.message ? error.message : error.toString();
      }
      return Observable.throw(errMsg);
   }
}
