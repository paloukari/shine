import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';

export class DynamicStatusMessageModel extends DynamicControlModel<string> {
   controlType = 'statusmessage';
   type: string;

   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);
      this.type = options['type'] || '';
   }

   public get message(): string {
      return this.node.children[0].textValue;
   }
}
