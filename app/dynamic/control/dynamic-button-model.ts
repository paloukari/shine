import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';

export class DynamicButtonModel extends DynamicControlModel<string> {
   controlType = 'button';
   type: string;

   callback: never;
   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);
      this.type = options['type'] || '';
   }
}
