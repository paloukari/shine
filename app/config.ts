export class Config {
   private _transactionKeywords: Object;

   constructor() {
      this._transactionKeywords = {};
   }

   public get TransactionKeywords(): Object {
      return this._transactionKeywords;
   }
   public set TransactionKeywords(v: Object) {
      this._transactionKeywords = v;
   }

}
