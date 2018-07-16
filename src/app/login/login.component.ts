import { Injectable, Inject, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { DatePipe } from '@angular/common';

import { WebApiService } from '../service/webapi';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  config;
  class_mess = "hidden";
  alert = "";
  constructor(
    private http: WebApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  //http://localhost:4200

  ngOnInit() {
    this.formInit();
  }


  async formInit() {
    try {
      this.config = await this.http.getFileJson("assets/config/config.json");

    } catch (e) {
      this.alert = "Hệ thông đang nâng cấp, vui lòng quay lại sau";
      this.class_mess = "";
    }
  }

  async loginSubmit(val: any) {
    try {
      console.log(val);
      if (val.username == null || val.username == undefined || val.username == "" ||
        val.password == null || val.password == undefined || val.password == "") {
        this.alert = "email, password không được để trống";
        this.class_mess = "";
        return;
      }

      var uri = this.config.Api + "api/agents/auth/" + val.username + "/" + val.password;
      var obj = await this.http.GetDataSync(uri, this.http.headersForm);
      console.log(obj);
      var data = JSON.parse(obj);
      console.log(data);
      if (data != null && data.business_id != null && data.business_id != undefined && data.business_id != "") {
        var para = {
          business_id: data.business_id,
          agent_id: data.user_id,
          token: data.access_token
        }
        localStorage.setItem("user",JSON.stringify(para));
        this.alert = "";
        this.class_mess = "hidden";
        this.router.navigate(['main/add-product']);
      }
      else {
        this.alert = "email, password không đúng";
        this.class_mess = "";
      }
    } catch (e) {
      console.log(e);
      this.alert = "Kiểm tra lại kết nối internet";
      this.class_mess = "";
    }

  }


}



