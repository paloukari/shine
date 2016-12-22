import { Injectable } from '@angular/core';
import { TransactionInfo } from './transaction-info';
import { TransactionAPI } from './transaction-API.service';
import { XmlProcessor } from '../services/xml-processor';

import { XmlDocument } from '../parser/transaction/xml-document';
import { Subject, Observable } from 'rxjs';
import { Link2TrnData } from './link-2-trn-data';
export class FormData {

}
@Injectable()
export class TransactionHandler {
    private _transactionStack: XmlDocument[] = [];
    private _link2TrnStream = new Subject<Link2TrnData>();
    private _transactionInfoData: Observable<{ link2TrnData: Link2TrnData, transactionInfo: TransactionInfo }>;
    private _transactionFileData: Observable<{ link2TrnData: Link2TrnData, transactionInfo: TransactionInfo, fileContent: string }>;

    private _documentStream = new Subject<XmlDocument>();

    constructor(private processor: XmlProcessor,
        private transactionService: TransactionAPI) {

        this._transactionInfoData =
            this._link2TrnStream
                .switchMap(e => {
                    return this.transactionService.getTransaction(e.name)
                        .map(v => {
                            return { transactionInfo: v, link2TrnData: e };
                        });
                })
                .catch(e => {
                    return Observable.throw(e);
                });


        this._transactionFileData =
            this._transactionInfoData
                .switchMap(e => {
                    return this.transactionService.getTransactionFile(e.transactionInfo.filename)
                        .map(v => {
                            return { link2TrnData: e.link2TrnData, transactionInfo: e.transactionInfo, fileContent: v };
                        });
                }).catch(e => {
                    return this._transactionFileData;
                });

        this._transactionFileData.subscribe(e => {
            if (e) {
                let treeRoot: Document = this.processor.processFile(e.fileContent);
                let document = new XmlDocument(treeRoot);
                // run formUpdate on this document first
                if (e.link2TrnData && e.link2TrnData.formUpdates) {
                    document.applyFormUpdates(e.link2TrnData.formUpdates);
                }
                this._transactionStack.push(document);
                this._documentStream.next(document);
            }
        });
    }

    public search(term: string) {
        this._transactionStack = [];
        this._link2TrnStream.next(new Link2TrnData(term, null));
    }

    public push(transactionCallData: Link2TrnData) {
        this._link2TrnStream.next(transactionCallData);
    }

    public pop() {
        this._transactionStack.pop();
        this._documentStream.next(this.current);
    }

    public get documentStream(): Observable<XmlDocument> {
        return this._documentStream;
    }

    private get current(): XmlDocument {
        if (this._transactionStack.length === 0) {
            return new XmlDocument(this.processor.processFile(`
<TRNDOC VER="3" startupjob="startup">
	<job name="startup">
		<input name="emptyform"/>
		<output name="form"/>
	</job>

	<form name="emptyform" >
		<label name="LBL" left="0" top="100" width="360" height="17" caption="Please fill in the transaction code to load" visible="-1"/>
	</form>
</TRNDOC>
`));
        }
        return this._transactionStack[this._transactionStack.length - 1];
    }
}
