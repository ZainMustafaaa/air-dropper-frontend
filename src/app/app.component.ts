import { Component, ViewChild } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { Service } from './api.service';
import { Http } from '@angular/http';
import { Transaction } from './test.transaction';
import {isNumeric} from "rxjs/util/isNumeric";
import { Router } from "@angular/router";
import { FileUtil } from './file.util';
import { Constants } from './app.constants';
var ethereum_address = require('../../node_modules/ethereum-address');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class AppComponent {
  
  @ViewChild('fileImportInput')
  fileImportInput: any;

  csvRecords = [];
  address = [];
  tokens = [];
  publicKey = "";
  privateKey = "";
  message = "";
  myValue = !true;

  _startLimit:number = 0;
  private _endLimit:number = 99;

  setPublicKey(param){
    this.publicKey = param.target.value;
  }

  setPrivateKey(param){
    this.privateKey = param.target.value;
  }

  setLimit(param){

    if(this.address.length == 0) return;

      let tmpLimit = Number(((document.getElementById("limit") as HTMLInputElement).value));
      if(!isNumeric(tmpLimit)){
        alert('Add Numeric Value only');
        return;
      }

      if(tmpLimit == 0){
        alert("Start Limit should be greater than 0");
      }
      else if(tmpLimit >= this.address.length){
          this._startLimit = this.address.length;
          this._endLimit = this.address.length;
        }
      else{
        this._startLimit = tmpLimit - 1;
        this._endLimit = this._startLimit;
        this._endLimit += 99;

        if(this._endLimit >= this.address.length){
          this._endLimit = this.address.length - 1;
        }
      }
  }

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private papa: PapaParseService,
    private service: Service
  ) { }
  
  ngOnInit() { }

  fileChangeListener($event): void {

    var text = [];
    var target = $event.target || $event.srcElement;
    var files = target.files; 

    if(Constants.validateHeaderAndRecordLengthFlag){
      if(!this._fileUtil.isCSVFile(files[0])){
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }

    var input = $event.target;

    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      let csvData = reader.result;
      
      let array = this.papa.parse(csvData,{
        complete: (results, file) => {
        }
      });

      let sizeArray = array['data'].length;

      let index = 0;

      while(index != sizeArray){
        if(ethereum_address.isAddress(array['data'][index][0])){
          this.address.push(array['data'][index][0]);
          this.tokens.push(array['data'][index][1]);       
          index++;
        }
        else if (array['data'][index][0].length>0) {
          alert('Invalid Ethereum Address '  + array['data'][index][0]);
          index++;
        }else {
          index++;
        }
      }
      
      if(this.csvRecords == null){
        this.fileReset();
      } 
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  };
}
