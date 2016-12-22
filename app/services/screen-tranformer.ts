import { Injectable } from '@angular/core';
import { DocumentTransformer } from '../shared/interfaces/documentTransformer';

@Injectable()
export class ScreenTransformerService implements DocumentTransformer {

   constructor() { }

   public transform(node: Node): Node {
      // todo:this is a quick hack
      return node;
   }
}
