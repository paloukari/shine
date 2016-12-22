import { Endpoint } from '../shared/interfaces/endpoint';
import { Subject, Observable, ReplaySubject } from 'rxjs';

export class XSLTEndpoint implements Endpoint {

   private _data: Node;
   private _eventStream: Subject<Node>;

   constructor() {
      this._eventStream = new ReplaySubject<Node>(1);
   }
   public setData(data: Node): void {
      this._data = data;
      this._eventStream.next(data);
   }

   public transform(transformation: Node): void {
      let address = (transformation.attributes['address'] as Attr);
      if (address) {
         let res = this._data.ownerDocument.evaluate(address.value,
            this._data.ownerDocument, null, XPathResult.ANY_TYPE, null).iterateNext();
         this.setData(res);
      } else {
         let processor = new XSLTProcessor();
         let stylesheet = _.find(transformation.childNodes, (child) => (child && child.nodeName === 'xsl:stylesheet'));
         processor.importStylesheet(stylesheet);
         let res = processor.transformToDocument(this._data.ownerDocument);
         this.setData(res.childNodes[0]);
      }
   }
   public getData(): Observable<Node> {
      return this._eventStream;
   }
}
