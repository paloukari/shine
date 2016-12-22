import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';

export class DynamicDropdownModel extends DynamicControlModel<any[]> {
   controlType = 'dropdown';
   isListBox = false;

   private _children: { key: string, value: string }[];

   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);

      if (this.children) {
         this.value = this.children;
      } else {
         this.value = [];
      }
      if (options['isListBox']) {
         this.isListBox = options['isListBox'] as boolean;
      }
   }

   public get children(): { key: string, value: string }[] {
      return this._children || (this.getChildren());
   }

   private getChildren(): { key: string, value: string }[] {
      this._children = [];
      this.node.children.forEach(option => {
         if (option.type === 'keyvalue') {
            let value = option.children[0].node.nodeValue;

            let nv = value.split('=');
            this._children.push({ key: nv[0], value: nv[1] });
         }
      });
      return this._children;
   }
}
