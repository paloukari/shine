import * as _ from 'lodash';

export class NodeWrapper {

   constructor(public node: Node) {
   }

   public get type(): string {
      return this.node.nodeName;
   }

   public get name(): string {
      if (this.node && this.node.attributes && this.node.attributes['name'] && (this.node.attributes['name'] as Attr)) {
         return (this.node.attributes['name'] as Attr).value;
      }
   }
   public get value(): any {
      let res = (this.node.attributes['value'] as Attr);
      if (res) {
         return res.value;
      }
   }
   public get textValue(): any {
      return this.node.nodeValue;
   }
   public get attributes(): NamedNodeMap {
      return this.node.attributes;
   }
   public get children(): NodeWrapper[] {
      return _.map(this.node.childNodes, node => new NodeWrapper(node));
   }

   public setControlNodeValue(name: string, value: string) {
      this.setControlNodeAttibute(name, 'value', value);
   }

   public setControlNodeAttibute(name: string, attributeName: string, attributeValue: string, type?: string, ) {
      for (let node of this.children) {
         if ((!type || node.type === type) && node.name === name) {
            if (node.attributes[attributeName]) {
               (node.attributes[attributeName] as Attr).value = attributeValue;
            } else {
               let attr = node.node.ownerDocument.createAttribute(attributeName);
               attr.value = attributeValue;
               node.attributes.setNamedItem(attr);
            }
         }
      }
   }

   public searchChild(type: string, options?: { attributeName: string, attributeValue: string }[]): NodeWrapper {
      for (let node of this.children) {
         if (node.type === type) {
            if (options) {
               for (let option of options) {
                  if (node.attributes[option.attributeName] && node.attributes[option.attributeName] === option.attributeValue) {
                     return node;
                  }
               };
            }
         }
      }
   }

   public getChildByName(name: string): NodeWrapper {
      for (let node of this.children) {
         if (node && node.attributes && node.attributes['name'] === name) {
            return node;
         }
      };
   }

   public replaceOrAddChild(node: Node) {
      let existing = _.filter(this.node.childNodes, e => {
         return e.nodeName === node.nodeName;
      });
      if (existing && existing.length > 0) {
         _.forEach(existing, e => this.node.removeChild(e));
      }
      this.node.appendChild(node);
   }
}
