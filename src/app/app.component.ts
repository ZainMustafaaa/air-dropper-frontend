import { Component, ViewChild } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { Service } from './api.service';
import { Transaction } from './test.transaction';
import { isNumeric } from "rxjs/util/isNumeric";
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

  _startLimit: number = 0;
  private _endLimit: number = 99;

  setPublicKey(param) {
    this.publicKey = param.target.value;
  }

  setPrivateKey(param) {
    this.privateKey = param.target.value;
  }

  setLimit(param) {

    if (this.address.length == 0) return;

    let tmpLimit = Number(((document.getElementById("limit") as HTMLInputElement).value));
    if (!isNumeric(tmpLimit)) {
      alert('Add Numeric Value only');
      return;
    }

    if (tmpLimit == 0) {
      alert("Start Limit should be greater than 0");
    } else if (tmpLimit >= this.address.length) {
      this._startLimit = this.address.length;
      this._endLimit = this.address.length;
    } else {
      this._startLimit = tmpLimit - 1;
      this._endLimit = this._startLimit;
      this._endLimit += 99;

      if (this._endLimit >= this.address.length) {
        this._endLimit = this.address.length - 1;
      }
    }
  }

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private papa: PapaParseService,
    private service: Service
  ) {}

  ngOnInit() {}

  fileChangeListener($event): void {

    var text = [];
    var target = $event.target || $event.srcElement;
    var files = target.files;

    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }

    var input = $event.target;

    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      let csvData = reader.result;

      let array = this.papa.parse(csvData, {
        complete: (results, file) => {}
      });

      let sizeArray = array['data'].length;

      let index = 0;

      while (index != sizeArray) {
        if (ethereum_address.isAddress(array['data'][index][0])) {
          this.address.push(array['data'][index][0]);
          this.tokens.push(array['data'][index][1]);
          index++;
        } else if (array['data'][index][0].length > 0) {
          alert('Invalid Ethereum Address ' + array['data'][index][0]);
          index++;
        } else {
          index++;
        }
      }

      if (this.csvRecords == null) {
        this.fileReset();
      }
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  };

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
    this.address = [];
    this.tokens = [];
  }

  saveTextAsFile(data, filename) {

    if (!data) {
      console.error('Console.save: No data')
      return;
    }

    if (!filename) filename = 'console.json'

    var blob = new Blob([data], {
        type: 'text/plain'
      }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  expFile(param) {

    if (!param) {
      var fileText = [JSON.stringify(this.address)];
      var fileName = "address.txt"
      this.saveTextAsFile(fileText, fileName);
    } else {
      var _fileText = '[' + this.tokens + ']';
      var _fileName = "tokens.txt"
      this.saveTextAsFile(_fileText, _fileName);
    }
  }

  sendTransaction(param) {

    if (this.address.length == 0) {
      alert("CSV FIle not selected");
      return;
    }
    var selectedAddress = [];
    var selectedTokens = [];
    var tmpStartLimit = this._startLimit;
    var tmpEndLimit = this._endLimit;

    while ((this._endLimit >= this._startLimit) && (this._startLimit <= this.address.length - 1)) {
      selectedAddress.push(this.address[this._startLimit]);
      selectedTokens.push(this.tokens[this._startLimit]);
      this._startLimit++;
    }
    if (this._startLimit >= this.address.length) {
      this._startLimit = this.address.length - 1;
      this._endLimit = this.address.length - 1;
    } else if (this._endLimit >= this.address.length) {
      this._endLimit = this.address.length - 1;
    } else {
      this._endLimit += 100;
    }


    var filename = 'filename'
    var blob = new Blob([JSON.stringify(this.address)], {
      type: 'text/plain'
    });
    console.log(blob);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      a.dispatchEvent(e);
    }



    let transaction = new Transaction(this.publicKey, this.privateKey, selectedAddress, selectedTokens);
    var data = this.service.postTransaction(transaction);
    alert("Please wait!");
  }
}