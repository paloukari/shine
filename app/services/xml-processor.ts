import { Injectable } from '@angular/core';

@Injectable()
export class XmlProcessor {
   constructor() {
   }

   processFile(xml: string): Document {
      return new DOMParser().parseFromString(xml, 'application/xml');
   }
}
