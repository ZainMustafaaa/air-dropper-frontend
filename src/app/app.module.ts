import { NgModule }                 from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule }            from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent }             from './app.component';
import { PapaParseModule } from 'ngx-papaparse';
import { HttpModule } from '@angular/http';
import { Service } from './api.service';
import { appRoutes } from './app.routes';


import { FileUtil } from './file.util';
import { Constants } from './app.constants';

@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PapaParseModule,
    HttpModule,
    FormsModule,
    	RouterModule.forRoot(appRoutes, {
			useHash: true
		})
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, Service, 
        FileUtil,
        Constants],
  bootstrap: [AppComponent]
})
export class AppModule { }
