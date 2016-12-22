import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';

export class DynamicCheckboxModel extends DynamicControlModel<string> {
   controlType = 'checkbox';
   type: string;

   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);
      this.type = options['type'] || this.controlType;
   }
}
