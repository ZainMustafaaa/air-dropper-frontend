import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Transaction } from './test.transaction';
import {Headers, } from '@angular/http';

import "rxjs/Rx";

@Injectable()
export class Service {

  constructor(private http: Http) { }

   postTransaction(model: Transaction) { 

        var response = false;
        var xhttp = new XMLHttpRequest();

    
        xhttp.open("POST", "BASE_URL/transferToken", true);        
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (String(xhttp.response).length > 25){
                    alert('Transaction Hash: ' + xhttp.response + '\n\n' + 'Note: Please wait for the next transaction until this transaction get successful  \n\n');

                }else {
                    alert('Transaction Failed.! \n\n Note: Please wait for the next transaction until previous transaction get successful \n\n ');
                }
            }
    };
        xhttp.send(JSON.stringify(model).toString());
  }

}
