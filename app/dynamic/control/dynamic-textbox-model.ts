import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';

export class DynamicTextboxModel extends DynamicControlModel<string> {

   controlType = 'textbox';
   type: string;

   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);
      this.type = options['type'] || '';
      if (!this.value) {
         this.value = this.initialtext || '';
      }
   }

   public get displaymask(): string {
      return this.readAttributeValue('displaymask');
   }

   public get initialtext(): string {
      return this.readAttributeValue('initialtext');
   }

}
