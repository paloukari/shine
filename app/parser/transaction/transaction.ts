import { Job } from './job';
import { DynamicActionModel } from '../../dynamic/action/dynamic-action-model';
import { EndpointType } from '../../shared/endpoint-type';
import { Endpoint } from '../../shared/interfaces/endpoint';
import { Observable } from 'rxjs';
import * as _ from 'lodash';


export class Transaction {

   public currentJob: Job;

   private _jobs: Node[];
   private _transformations: Node[];
   private _codeformupdate: Node[];
   private _forms: Node[];

   private _endpoints: Object = {};

   constructor(private node: Node) {
   }

   public evaluate(clause: string, xPathResult: number): XPathResult {
      return this.node.ownerDocument.evaluate(clause, this.node, null, xPathResult, null);
   }
   public get startupjob(): string {
      return (this.node.attributes['startupjob'] as Attr).value;
   }

   public get version(): string {
      return (this.node.attributes['VER'] as Attr).value as string;
   }

   public get children(): NodeList {
      return this.node.childNodes;
   }

   public get jobs(): Node[] {
      return this._jobs ? this._jobs : this._jobs = this.getChildrenByType('job');
   }

   public get transformations(): Node[] {
      return this._transformations ? this._transformations : this._transformations = this.getChildrenByType('transformation');
   }

   public get codeformupdate(): Node[] {
      return this._codeformupdate ? this._codeformupdate : this._codeformupdate = this.getChildrenByType('codeformupdate');
   }

   public get forms(): Node[] {
      return this._forms ? this._forms : this._forms = this.getChildrenByType('forms');
   }

   private getChildrenByType(name: string): Node[] {
      let ret: Node[] = [];
      _.forEach(this.node.childNodes, (node) => {
         if (node && node.nodeName === name) {
            ret.push(node);
         }
      });
      return ret;
   }
   public getChildByName(name: string): Node {
      return _.find(this.node.childNodes, (node) => ((node.attributes != null && node.attributes['name'] as Attr).value === name));
   }

   public getJobByName(name: string): Node {
      return this.jobs.find(node => (node.attributes['name'] as Attr).value === name);
   }


   public appendChild(child: Node) {
      this.node.appendChild(child);
   }

   public onNotify(input?: DynamicActionModel) {
      // it's a pop
      if (!input && this.currentJob && this.currentJob.isPaused) {
         this.currentJob.execute(null);
      } else {
         this.handleHotkeys(input);
         // it's a new transaction or a new user event
         let name = this.getActionFromUserInput(input);
         if (name) {
            let job = new Job(this.getJobByName(name), this, input);

            if (this.currentJob) {
               this.currentJob.dispose();
            }
            this.currentJob = job;

         }
         this.currentJob.execute(input);
      }

   }
   private handleHotkeys(input: DynamicActionModel) {
      if (input && input.keyboardEvent && input.formModel && input.formModel.controls) {

         _.forOwn(input.formModel.controls, (value, key) => {
            let mapped = this.mapHotKey(value.hotkey);
            if (mapped === input.keyboardEvent.code) {
               input.controlModel = value;
               input.keyboardEvent.stopPropagation();
               input.keyboardEvent.preventDefault();
               return;
            }
         });
      }
   }
   private getActionFromUserInput(input?: DynamicActionModel): string {
      if (!input) {
         return this.startupjob;
      }
      if (input.controlModel && input.controlModel.onclick) {
         return input.controlModel.onclick;
      }
   }
   private mapHotKey(hotKey: string) {
      if (hotKey === 'ESC') {
         return 'Escape';
      }
      return hotKey;
   }
   public setEndpoint(endpoint: Endpoint, type: EndpointType) {
      this._endpoints[type] = endpoint;
   }
   public setEndpointData(type: EndpointType, node: Node, transform?: Node) {
      if (this._endpoints[type] && (this._endpoints[type] as Endpoint)) {
         if (node) {
            (this._endpoints[type] as Endpoint).setData(node);
         }
         if (transform) {
            (this._endpoints[type] as Endpoint).transform(transform);
         }
      }
   }
   public getEndpointData(type: EndpointType): Observable<Node> {
      if (this._endpoints[type] && (this._endpoints[type] as Endpoint)) {
         return (this._endpoints[type] as Endpoint).getData();
      }
   }
}
