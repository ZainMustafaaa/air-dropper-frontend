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

  }
