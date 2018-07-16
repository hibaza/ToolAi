import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";

import { WebApiService } from './service/webapi'
import { HelperService } from './service/helper.service'

import { ScrollEventModule } from 'ngx-scroll-event';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { AddProductHandComponent } from './add-product-hand/add-product-hand.component';
import { LoginComponent } from './login/login.component';
import { routing } from './app.routing';

import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AppHeaderComponent } from './_layout/app-header/app-header.component';
import { SiteHeaderComponent } from './_layout/site-header/site-header.component';
import { SiteFooterComponent } from './_layout/site-footer/site-footer.component';
import { EditProductHandComponent } from './edit-product-hand/edit-product-hand.component';
import { WitupsertService } from './wit/witupsert.service';

@NgModule({
  declarations: [
    AppComponent,
    AddProductHandComponent,
    LoginComponent,

    AppLayoutComponent, 
    SiteLayoutComponent, 
    AppHeaderComponent, 
    SiteHeaderComponent, 
    SiteFooterComponent, 
    LoginComponent, EditProductHandComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    MultiselectDropdownModule,
    ScrollEventModule,
    routing
  ],
  providers: [
    WebApiService,
    DatePipe,
    HelperService,
WitupsertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
