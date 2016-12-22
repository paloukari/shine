export class Link2TrnData {

   constructor(private _name: string, private _formUpdates: Node[]) {
   }
   public get name(): string {
      return this._name;
   }

   public get formUpdates(): Node[] {
      return this._formUpdates;
   }
}
