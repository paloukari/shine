import { Endpoint } from '../shared/interfaces/endpoint';
import { NodeWrapper } from '../parser/transaction/node-wrapper';
import { Subject, Observable, ReplaySubject } from 'rxjs';

export class FormEndpoint implements Endpoint {

   private _data: Node;
   private _eventStream: Subject<Node>;

   constructor() {
      this._eventStream = new ReplaySubject<Node>(1);
   }

   getChild(document: Node, nodeName: string) {
      for (let index = 0; index < document.childNodes.length; index++) {
         let element = document.childNodes[index];
         if (element.nodeName === nodeName) {
            return element;
         }
      }
   }

   setData(document: Node) {

      let form = this.getChild(document.firstChild, 'form');
      let formupdate = this.getChild(document.firstChild, 'formupdate');
      let codeformupdate = this.getChild(document.firstChild, 'codeformupdate');

      if (form) {
         this._data = form;
         this._eventStream.next(this._data);
      }

      if (formupdate) {
         this.transform(formupdate);
      }

      if (codeformupdate) {
         this.transform(codeformupdate);
      }
   }

   public transform(transformation: Node): void {
      let wrapper = new NodeWrapper(this._data);
      _.forEach(transformation.childNodes, (child) => {
         let isUpdateToExisting = false;
         if (child.attributes) {
            _.forEach(child.attributes, (attr) => {
               if (attr && attr.name !== 'name') {
                  wrapper.setControlNodeAttibute(child.attributes['name'].value, attr.name, attr.value, child.nodeName);
                  isUpdateToExisting = true;
               }
            });
         }
         if (!isUpdateToExisting && child.nodeName !== '#text') {
            // probably we have a reserved node name like statusmessage
            // add the node
            wrapper.replaceOrAddChild(child.cloneNode(true));
         }
      });
      this._eventStream.next(this._data);
   }


   public getData(): Observable<Node> {
      return this._eventStream;
   }
}
