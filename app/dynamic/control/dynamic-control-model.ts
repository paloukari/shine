import { NodeWrapper } from '../../parser/transaction/node-wrapper';
import * as _ from 'lodash';


export class DynamicControlModel<T>{

   attibutes: Object = {};
   value: T;
   key: string;
   controlType: string;

   constructor(protected node: NodeWrapper, options: {
      value?: T,
      key?: string,
      controlType?: string
   } = {}) {

      this.attibutes = node.attributes;
      this.value = options.value;
      this.key = options.key || '';
      this.controlType = options.controlType || '';


      if (this.attibutes && (this.attibutes['value'] as Attr) && (this.attibutes['value'] as Attr).value) {
         this.value = <T><any>(this.attibutes['value'] as Attr).value;
      }
   }

   public clicked(event: Event) {
      throw Error('Not Implemented!');
   }

   public readAttributeValue(name: string): string {
      let attribute = this.attibutes[name] as Attr;
      if (attribute) {
         return attribute.value;
      }
      return null;
   }

   public readChildren(nodeName: string): any[] {
      return _.filter(this.node.children, (e) => {
         if (e.name === 'row') {
            return e;
         }
      });
   }

   public get caption(): string {
      return this.readAttributeValue('caption');
   }

   public get align(): string {
      return this.readAttributeValue('align');
   }

   public get enabled(): string {
      return this.readAttributeValue('enabled');
   }

   public get fieldtype(): string {
      return this.readAttributeValue('fieldtype');
   }

   public get height(): string {
      return this.readAttributeValue('height');
   }

   public get left(): number {
      return Number(this.readAttributeValue('left'));
   }

   public get name(): string {
      return this.readAttributeValue('name');
   }

   public get required(): boolean {
      return this.readAttributeValue('optional') === '1';
   }

   public get tabindex(): string {
      return this.readAttributeValue('tabindex');
   }

   public get tabstop(): string {
      return this.readAttributeValue('tabstop');
   }

   public get top(): string {
      return this.readAttributeValue('top');
   }

   public get validation(): string {
      return this.readAttributeValue('validation');
   }

   public get visible(): string {
      return this.readAttributeValue('visible');
   }
   public get width(): number {
      return Number(this.readAttributeValue('width'));
   }
   public get onclick(): string {
      return this.readAttributeValue('onclick');
   }
   public get hotkey(): string {
      return this.readAttributeValue('hotkey');
   }
}
