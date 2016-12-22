import { NodeWrapper } from './node-wrapper';

export class Form {

   private _controls: NodeWrapper[] = [];

   constructor(public node: Node) {

      this._controls = [];
      for (let i = 0; i < this.node.childNodes.length; i++) {
         this._controls.push(new NodeWrapper(this.node.childNodes[i]));
      }
   }

   public get controls(): NodeWrapper[] {
      return this._controls;
   }
}
