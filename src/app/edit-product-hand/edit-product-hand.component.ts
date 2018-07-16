//http://localhost:4200/?business_id=150146656&token=abc&agent_id=123456789

import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../service/webapi';
import { HelperService } from '../service/helper.service';
import { ActivatedRoute } from "@angular/router";
import { JsonpModule } from '@angular/http';
import { Router } from "@angular/router";
import { WitupsertService } from '../wit/witupsert.service';
@Component({
  selector: 'app-edit-product-hand',
  templateUrl: './edit-product-hand.component.html',
  styleUrls: ['./edit-product-hand.component.css']
})
export class EditProductHandComponent implements OnInit {

  config;
  para = {
    business_id: "",
    token: "",
    agent_id: ""
  }
  products: any[] = [];

  product = {};
  productKeys: String[];

  template_id = "";
  templates;
  productSelect = { title: "", i: 0 };

  newProducts = [{ name: "product", value: "", desc: "", type: "text" }];


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
    try {
      var uri = this.config.Api + "api/token-wit/get-by-businessid";
      var para = { para: JSON.stringify({ business_id: this.para.business_id, token: this.para.token }) };
      var obj = await this.http.PostJsonAsync(uri, para, this.http.headersJson);
      var data = JSON.parse(obj);
      if (data != null) {
        this.http.headersWit.append('Authorization', "Bearer " + data.wittoken);
      }
    } catch (e) { console.log(e); }
  }
  async copyProducts(product: any) {
    try {
      this.refreshForm();

      var uri = this.config.Api + "api/ProductAddHandTool/SearchProducts";

      var para = {
        para: JSON.stringify({
          business_id: this.para.business_id,
          product: product,
          token: this.para.token
        })
      };
      var obj = await this.http.PostJsonAsync(uri, para, this.http.headersJson);

      var data = JSON.parse(obj);
      this.products = data;
    } catch (e) { console.log(e); }
  }

  async submitEditForm(value: any) {
    try {
      var i = 0;
      if (this.newProducts != null && this.newProducts != undefined && this.newProducts.length > 0) {
        this.newProducts.forEach(element => {
          if (element.name != undefined && element.name != "") {
            var value: any;
            if (element.type == "number") {
              try{
                value = Number(this.helperService.extracNumber(element.value.toLowerCase().trim()));
              }catch(ex){
                value = Number(element.value);
               }              
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
      } else {
        this.upsertProduct();
      }
    } catch (e) { console.log(e); }
  }


  async upsertProduct() {
    try {
      await this.formatProduct();
      if (this.product["product"] != null && this.product["product"] != undefined && this.product["product"].value != undefined && this.product["product"] != "") {

        var id = this.para.business_id + "_" + this.product["product"].value;

        this.product["business_id"] = this.para.business_id;
        this.product["id"] = this.products[this.productSelect.i].id;
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
      console.log(e);
      this.alert.error = "";
      this.alert.ok = "hidden";
      this.alert.mess = "Cập nhật lỗi";

    }
  }

  async formatProduct() {
    try {
      var keys = Object.keys(this.product);
      keys.forEach(element => {
        if (this.product[element].value != undefined && this.product[element].value != "") {
          var value: any;
          if (this.product[element].type == "number") {
           try{
            value = Number(this.helperService.extracNumber(this.product[element].value.toLowerCase().trim()));
           }catch(ex){
            value = Number(this.product[element].value);
           }
           
          }
          if (this.product[element].type == "size") {
            if (this.product[element].value != null && this.product[element].value != undefined && this.product[element].value != "")
              value = this.product[element].value;
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
    } catch (e) { console.log(e); }
  }


  async addRowNew() {
    this.newProducts.push({ name: "", value: "", desc: "", type: "text" });
  }

  async refreshForm() {
    this.products = [];
    this.product = {};
    this.newProducts = [{ name: "", value: "", desc: "", type: "text" }];
    this.productKeys = [];
    this.alert.ok = "hidden";
    this.alert.error = "hidden";
    this.alert.mess = "";
  }


  async viewRow(i: any) {
    try {
      var j = 0;
      this.productSelect.i = i;
      var keys = Object.keys(this.products[i]);
      keys.forEach(element => {
        if (this.products[i][element].value != undefined) {
          var item = {
            value: this.products[i][element].value,
            desc: this.products[i][element].desc,
            type: this.products[i][element].type
          };
          this.product[element] = item;
        }
        j++;
        if (j >= keys.length) {
          this.productSelect.title = this.product["product"].value;
          this.template_id = this.products[i]["template_id"];
          this.productKeys = Object.keys(this.product);
        }
      });
    } catch (e) { console.log(e); }
  }

  async deleteRow(key: any) {

    delete this.product[key];
    this.productKeys = Object.keys(this.product);
  }
  // async productEditChecked(data: any, checked: any) {
  //   var i = 0;
  //   data.forEach(element => {

  //     if (checked == "checked")
  //       element["checked"] = "checked";
  //     else {
  //       delete element["checked"];
  //     }
  //     i++;
  //     if (i >= data.length) {
  //       this.products = data;
  //     }
  //   });
  // }


  // async ParentCheckedChange() {
  //   if (this.allChecked == "checked") {
  //     this.allChecked = "";

  //   }
  //   else
  //     this.allChecked = "checked";
  // }
  // async ChilrentCheckedChange(i: any) {
  //   this.products[i]["checked"] = this.products[i]["checked"] == "checked" ? "" : "checked";

  // }
}


