//http://localhost:4200/?business_id=150146656&token=abc&agent_id=123456789

import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../service/webapi';
import { HelperService } from '../service/helper.service';
import { JsonpModule } from '@angular/http';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { WitupsertService } from '../wit/witupsert.service';
@Component({
  selector: 'app-add-product-hand',
  templateUrl: './add-product-hand.component.html',
  styleUrls: ['./add-product-hand.component.css']
})
export class AddProductHandComponent implements OnInit {

  config;
  para = {
    business_id: "",
    token: "",
    agent_id: ""
  }
  product = {};
  newProducts = [{ name: "product", value: "", desc: "", type: "text" }];
  productKeys: String[];
  templates: any[] = [];
  template_id = "";


  alert = { error: "hidden", mess: "", ok: "hidden" };
  constructor(
    private http: WebApiService,
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService,
    private witUpsert: WitupsertService
  ) { }

  ngOnInit() {

    var userStr = localStorage.getItem("user");
    if (userStr != null && userStr != undefined) {
      var user = JSON.parse(userStr);
      this.para.business_id = user.business_id,
        this.para.token = user.token,
        this.para.agent_id = user.agent_id
    }
    this.formInit();
  }

  async formInit() {
    try {
      this.config = await this.http.getFileJson("assets/config/config.json");

      if (this.para.business_id == null || this.para.business_id == undefined || this.para.business_id == "" ||
        this.para.agent_id == null || this.para.agent_id == undefined || this.para.agent_id == "" ||
        this.para.token == null || this.para.token == undefined || this.para.token == ""
      ) {
        this.router.navigate(['']);
        return;
      }
      var uri = this.config.Api + "api/Templates/GetList/";
      var para = { para: JSON.stringify({ business_id: this.para.business_id, token: this.para.token }) };
      var obj = await this.http.PostJsonAsync(uri, para, this.http.headersJson);

      var data = JSON.parse(obj);
      if (data.length > 0)
        this.template_id = data[0].id;
      this.templates = data;
      this.getTokenWit();

    } catch (e) {
      console.log(e);
      this.alert.error = "";
      this.alert.ok = "hidden";
      this.alert.mess = "Kiểm tra lại kết nối internet";
    }
  }

  async getTokenWit() {
    var uri = this.config.Api + "api/token-wit/get-by-businessid";
    var para = { para: JSON.stringify({ business_id: this.para.business_id, token: this.para.token }) };
    var obj = await this.http.PostJsonAsync(uri, para, this.http.headersJson);
    var data = JSON.parse(obj);
    if (data != null) {
      this.http.headersWit.append('Authorization', "Bearer " + data.wittoken);
    }
  }
  async copyProducts(product: any) {
    this.refreshForm();

    var uri = this.config.Api + "api/ProductAddHandTool/SearchProduct";

    var para = {
      para: JSON.stringify({
        business_id: this.para.business_id,
        product: product,
        token: this.para.token
      })
    };
    var obj = await this.http.PostJsonAsync(uri, para, this.http.headersJson);

    var data = JSON.parse(obj);
    var i = 0;
    var keys = Object.keys(data);
    keys.forEach(element => {
      if (data[element].value != undefined) {
        var item = {
          value: data[element].value,
          desc: data[element].desc, type: data[element].type
        };
        this.product[element] = item;
      }
      i++;
      if (i >= keys.length) {
        if (data["template_id"] != undefined && data["template_id"] != "")
          this.template_id = data["template_id"];
        this.productKeys = Object.keys(this.product);
      }
    });
  }


  async formatProduct() {
    var keys = Object.keys(this.product);
    keys.forEach(element => {
      if (this.product[element].value != undefined && this.product[element].value != "") {
        var value: any;
        if (this.product[element].type == "number") {
          value = Number(this.product[element].value);
        }
        if (this.product[element].type == "size") {
          if (this.product[element].value != null && this.product[element].value != undefined && this.product[element].value != "")
            value = JSON.parse(this.product[element].value);
          else {
            value = [];
          }
        }
        if (value == null || value == undefined || value == "")
          value = this.product[element].value;
        if (this.product[element].type == "text")
          value = this.helperService.removeUnikey(this.product[element].value.toLowerCase().trim());
        if (this.product[element].value != null && this.product[element].value != undefined)
          this.product[element].value = value;
      }
    });
  }

  async submitForm(form: any) {

    var i = 0;
    this.newProducts.forEach(element => {
      if (element.name != undefined && element.name != "") {
        var value: any;
        if (element.type == "number") {
          value = Number(element.value);
        }
        if (element.type == "size") {
          if (element.value != null && element.value != undefined && element.value != "")
            value = JSON.parse(element.value);
          else {
            value = [];
          }
        }
        if (value == null || value == undefined || value == "")
          value = element.value;
        if (element.type == "text")
          element.value = this.helperService.removeUnikey(element.value.toLowerCase().trim());

        this.product[element.name] =
          {
            value: value,
            desc: element.desc,
            type: element.type
          };
      }
      i++;
      if (i >= this.newProducts.length) {
        this.upsertProduct();
      }
    });

  }

  async upsertProduct() {
    try {
      await this.formatProduct();

      if (this.product["product"] != null && this.product["product"] != undefined && this.product["product"].value != undefined && this.product["product"] != "") {
        var id = this.para.business_id + "_" + this.product["product"].value;

        this.product["business_id"] = this.para.business_id;
        this.product["id"] = id;
        this.product["template_id"] = this.template_id;

        var uri = this.config.Api + "api/ProductAddHandTool/AddProduct/" + this.para.business_id + "/" + id + "/" + this.template_id;
        var para = { para: JSON.stringify(this.product) };
        var rs = await this.http.PostJsonAsync(uri, para, this.http.headersJson);
        this.witUpsert.InsertToWit(this.product, this.config);

        if (rs != null && rs) {
          this.alert.error = "hidden";
          this.alert.ok = "";
          this.alert.mess = "Cập nhật ok";
        }
      }
    } catch (e) {
      this.alert.error = "";
      this.alert.ok = "hidden";
      this.alert.mess = "Cập nhật lỗi";

    }
  }

  async addRowNew() {
    this.newProducts.push({ name: "", value: "", desc: "", type: "text" });
  }

  async refreshForm() {
    this.product = {};
    this.newProducts = [{ name: "", value: "", desc: "", type: "text" }];
    this.productKeys = [];
    this.alert.ok = "hidden";
    this.alert.error = "hidden";
    this.alert.mess = "";
  }

  async deleteRow(key: any) {

    delete this.product[key];
    this.productKeys = Object.keys(this.product);
  }


}
