import { DynamicControlModel } from './dynamic-control-model';
import { NodeWrapper } from '../../parser/transaction/node-wrapper';
import * as _ from 'lodash';

export class DynamicTableModel extends DynamicControlModel<string> {
   controlType = 'grid';
   type: string;

   constructor(node: NodeWrapper, options: {} = {}) {
      super(node, options);
      this.type = options['type'] || '';
   }

   public get data(): any[] {
      let children = this.readChildren('row');
      if (children) {
         return _.map(children, c => {
            let row = new NodeWrapper(c as Node);

            if (row && row.children && _.filter(row.children, e => e.name === 'col')) {
               let rowData = {};
               let i = 1;
               _.forEach(_.filter(row.children, e => e.name === 'col'), (h) => rowData[i] = h);
               return rowData;
            }

         });
      }
   }


   public get options(): any {
      return {
         stretchH: 'all',
         columnSorting: true,
         contextMenu: [
            'row_above', 'row_below', 'remove_row'
         ]
      };
   }
   public get colHeaders(): any {
      if (!this.formatstring) {
         return [];
      }
      return this.formatstring.split('|');
   }

   public get columns(): Array<any> {
      let columns: any[] = [];
      for (let i = 1; i <= this.cols; i++) {
         columns.push({
            data: i,
            readOnly: i <= this.fixedcols
         });
      }
      return columns;

   }
   public get colWidths(): Array<number> {
      // todo: read the format string and set the lengths
      return [null, 20, 30];
   }

   public get formatstring(): string {
      return this.readAttributeValue('formatstring');
   }

   public get cols(): number {
      return +this.readAttributeValue('cols');
   }

   public get fixedcols(): number {
      return +this.readAttributeValue('fixedcols');
   }


}
