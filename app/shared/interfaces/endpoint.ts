import { Observable } from 'rxjs';

export interface Endpoint {
   setData(data: Node): void;
   getData(): Observable<Node>;
   transform(transformation: Node): void;
}
