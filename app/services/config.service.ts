import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ConfigService {
   public settings: any;
   public transactionVocabulary: any;
   constructor(private http: Http) {
   }

   load() {
      return new Promise((resolve) => {
         this.http.get('app/config/app-config.json').map(res => res.json())
            .subscribe(settings => {
               console.log('Configuration loaded...........');
               this.settings = settings;
               resolve();
            });

         this.http.get('app/config/transaction-vocabulary.json').map(res => res.json())
            .subscribe(vocabulary => {
               console.log('transaction vocabulary loaded...........');
               this.transactionVocabulary = vocabulary;
               resolve();
            }, (error) => {
               console.log(error);

               this.http.get('app/config/transaction-vocabulary.public.json').map(res => res.json())
                  .subscribe(vocabulary => {
                     console.log('public transaction vocabulary loaded...........');
                     this.transactionVocabulary = vocabulary;
                     resolve();
                  });
            });
      });
   }

}
