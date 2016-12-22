import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';

export class DynamicLabelModel extends DynamicControlModel<string> {
   controlType = 'label';
   type: string;

   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);
      this.type = options['type'] || '';
   }
}
