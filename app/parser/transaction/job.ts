import { Transaction } from './transaction';
import { DynamicActionModel } from '../../dynamic/action/dynamic-action-model';
import { EndpointType } from '../../shared/endpoint-type';
import { Disposable } from '../../shared/interfaces/disposable';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';
import { TransactionHandler } from '../../services/transaction-handler.service';
import { Link2TrnData } from '../../services/link-2-trn-data';
import { ConfigService } from '../../services/config.service';
import { rootInjector } from '../../main';

import * as _ from 'lodash';

export class Job implements Disposable {
   private _step = 0;

   private _tranformation: Node;
   private _function: Node;
   private _form: Node;
   private _exited = false;
   private _paused = false;
   private _steps: Node[] = [];

   private _document: Document;

   private _transactionHandler: TransactionHandler;
   private _transactionVocabulary: any;

   public get document(): Node {
      return this._document;
   }



   dispose: () => void;

   constructor(private node: Node,
      private transaction: Transaction,
      private input?: DynamicActionModel) {

      this._transactionHandler = rootInjector.get(TransactionHandler);
      let config = rootInjector.get(ConfigService) as ConfigService;
      this._transactionVocabulary = config.transactionVocabulary;

      let formSubscription = this.transaction.getEndpointData(EndpointType.Form).subscribe(e => {
         this._form = e;
      });

      let functionSubscription = this.transaction.getEndpointData(EndpointType.Function).subscribe(e => {
         this._function = e;

      });

      this.dispose = () => {
         functionSubscription.unsubscribe();
         formSubscription.unsubscribe();
      };

      if (input) {
         this._form = input.formModel.form.node;
      }
      if (this.node) {
         for (let i = 0; i < this.node.childNodes.length; i++) {
            this._steps.push(this.node.childNodes[i].cloneNode(true));
         }
      }
   }

   public get form(): Node {
      return this._form;
   }

   public get steps() {
      return this._steps.length;
   }

   public execute(input?: DynamicActionModel) {

      this._paused = false;

      if (input && input.controlModel && input.controlModel.attibutes
         && (input.controlModel.attibutes['cancel'] as Attr) && (input.controlModel.attibutes['cancel'] as Attr).value === '-1') {
         this._transactionHandler.pop();
         this._exited = true;
         return;
      }

      while (!this.isComplete() && !this.isPaused()) {
         this.executeStep(input);
      }
   }


   public isPaused(): boolean {
      return this._paused;
   }
   public isComplete(): boolean {
      return this._step + 1 >= this.steps || this._exited;
   }

   syncFormModel(form: Node) {

      let wrappedNode = new NodeWrapper(form);

      if (this.input && this.input.form && this.input.form.controls) {
         _.forOwn(this.input.form.controls, (value, key) => { wrappedNode.setControlNodeValue(key, value.value); });
      }

   }

   public executeStep(input?: DynamicActionModel) {

      let step = this._steps[this._step++];
      let data: Node;

      switch (step.nodeName) {
         case this._transactionVocabulary.read:
            if (step.attributes['name'] as Attr) {
               let inputName = (step.attributes['name'] as Attr).value;
               if (inputName === this._transactionVocabulary.screen) {
                  // todo:check this
                  data = this._form;
                  this.syncFormModel(data);
                  this.setInputData(data as Element, this._transactionVocabulary.transactionRoot, null);
               } else {
                  data = this.transaction.getChildByName(inputName);
                  this.setInputData(data as Element, null, null);
               }
            } else {
               data = step.childNodes[1];
               this.setInputData(data as Element, null, null);
            }

            break;
         case this._transactionVocabulary.write:
            let outputName = (step.attributes['name'] as Attr).value;
            if (outputName === this._transactionVocabulary.screen) {
               this.transaction.setEndpointData(EndpointType.Form, this._document, this._tranformation);
            }
            break;
         case this._transactionVocabulary.reset:
            this.clearData();
            break;
         case this._transactionVocabulary.function:

            let nameAttr = (step.attributes['name'] as Attr);
            if (nameAttr) {
               let name = nameAttr.value;
               data = this.transaction.getChildByName(name);
            } else {
               data = step;
            }

            this.setTransformationData(data);
            this.transaction.setEndpointData(EndpointType.Function, this._document.firstChild, this._tranformation);
            this.setInputData(this._function as Element, null, null);
            this.setTransformationData(null);

            let addressAttr = (step.attributes[this._transactionVocabulary.address] as Attr);
            if (addressAttr) {
               this.pushStep(this._function);
            }

            break;

         case this._transactionVocabulary.transaction:

            let trn = _.find((step as Element).children, (e) => {
               return e.nodeName === this._transactionVocabulary.transactionName;
            });

            let formUpdates = _.filter((step as Element).children, (e) => {
               return e.nodeName === this._transactionVocabulary.screenUpdate;
            });
            if (trn && trn.attributes['name'] && trn.attributes['name'] as Attr && (trn.attributes['name'] as Attr).value) {
               let trnName = (trn.attributes['name'] as Attr).value;
               this._transactionHandler.push(new Link2TrnData(trnName, formUpdates));
               this._paused = true;
               return;
            }
            break;

         case this._transactionVocabulary.condition:
            let ifAttr = step.attributes[0];
            let clause = ifAttr.value;

            switch (ifAttr.name) {
               case this._transactionVocabulary.false: {
                  let result = this.transaction.evaluate(clause, XPathResult.BOOLEAN_TYPE);
                  if (!result.booleanValue) {
                     this.pushSteps(step.childNodes);
                  }
               }
                  break;
               case this._transactionVocabulary.true: {
                  let result = this.transaction.evaluate(clause, XPathResult.BOOLEAN_TYPE);
                  if (result.booleanValue) {
                     this.pushSteps(step.childNodes);
                  }
               }
                  break;
               // todo: what else?
               default:
                  break;
            }
            break;

         case this._transactionVocabulary.action:
            let name = (step.attributes['name'] as Attr).value;
            if (name) {
               let job = new Job(this.transaction.getJobByName(name), this.transaction);
               job.execute();

               for (let i = 0; i < job.document.childNodes.length; i++) {
                  let node = job.document.childNodes[i];
                  // todo: merge same name nodes?
                  this.setInputData(node as Element, node.nodeName, name);
               }
            }
            break;

         case this._transactionVocabulary.return:
            this._exited = true;
            break;
         case this._transactionVocabulary.method:
            break;

         default:
            break;
      }

   }
   private pushSteps(steps: NodeList): void {
      for (let i = steps.length - 1; i > 0; i--) {
         this._steps.splice(this._step, 0, steps[i]);
      }
   }

   private pushStep(step: Node): void {
      this._steps.splice(this._step, 0, step);
   }

   private initDocument(data: Node) {
      this._document = data.ownerDocument.cloneNode(true) as Document;
      while (this._document.childNodes.length > 0) {
         this._document.removeChild(this._document.childNodes[0]);
      }
      this._document.appendChild(this._document.createElement('input'));
   }
   private setInputData(data: Element, nodeName: string, parentNodeName: string): void {

      if (!this._document) {
         this.initDocument(data);
      }

      // do rename
      let input: Node;
      if (nodeName) {
         input = this._document.createElement(nodeName);
         (input as Element).innerHTML = data.innerHTML;
      } else {
         input = data;
      }
      if (parentNodeName) {
         let parent = this._document.createElement(parentNodeName);
         parent.appendChild(input);
         input = parent;
      }

      if (!this._document.firstChild.contains(input)) {
         this._document.firstChild.appendChild(input);
      } else {
         this._document.firstChild.removeChild(input);
         this._document.firstChild.appendChild(input);
      }
   }


   private setTransformationData(data: Node): void {
      if (data && !this._document) {
         this.initDocument(data);
      }
      this._tranformation = data;
   }

   private clearData(): void {
      this._document = null;
      this._tranformation = null;
   }

   private fixTRN(data: Element): Node {
      let cloneDocument: Document = data.ownerDocument.cloneNode(true) as Document;

      let index: number = -1;
      for (let i = 0; i < cloneDocument.childNodes[0].childNodes.length; i++) {
         if (cloneDocument.childNodes[0].childNodes[i].nodeName === data.nodeName) {
            index = i;
            break;
         }
      }
      let trn = cloneDocument.createElement(this._transactionVocabulary.transactionRoot);
      trn.innerHTML = data.innerHTML;
      cloneDocument.childNodes[0].childNodes[index].parentNode.replaceChild(trn, cloneDocument.childNodes[0].childNodes[index]);
      return trn;
   }
}
