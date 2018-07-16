import { Injectable } from '@angular/core';
import { WebApiService } from '../service/webapi';

@Injectable()
export class WitupsertService {

  constructor(
    private http: WebApiService,
  ) { }



  async InsertToWit(product: any,config:any) {
    var productValue = product.product.value;
    var parentProduct = product.parentproduct.value;
      try {

        if (productValue != null && productValue != undefined) {
          var paraCheck = "WitEntitiesCheck('product'," +
            "'" + parentProduct + "'" +
            ",'" + productValue + "')";

          var configCheck = {
            mongoconnect: "ConnAi", mongodb: "AiDb", collectionname: "WitEntities",
            type: "procedure"
          };

          var jsonCheck = { config: JSON.stringify(configCheck), para: JSON.stringify(paraCheck) };

          let result = await this.http.PostFormSync(config.Api+"api/procedure/execute", jsonCheck, this.http.headersForm);
          console.log(result);
          if (result != null && result != undefined) {
            var check = JSON.parse(result);
            var paraSql = "WitEntitiesRemove('product'," +
              "'" + parentProduct + "'" +
              ",'" + productValue + "'" +
              ",'" + check.action.toLowerCase() + "')";
            if (check.action.toLowerCase() == "createentities") {
              await this.wit_CreateEntitiess(product, productValue, parentProduct, 
                check, paraSql,config);
            }
            if (check.action.toLowerCase() == "createkeyword") {
              await this.wit_CreatKeyword(product, productValue, parentProduct, check,
                 paraSql,config);
            }
            if (check.action.toLowerCase() == "addsynonym") {
              await this.wit_AddSynonym(product, productValue, parentProduct, check,
                 paraSql,config)
            }
          }
        }
      } catch (e) { console.log(e); }
   
  }
  
  async wit_CreateEntitiess(product: any,productValue:any, parentProduct: any, 
    resultCheck: any, paraSql: any,config:any) {
    try {
      console.log("create entitie");
      var entitiesAdd = {
        doc: productValue.toLowerCase(),
        id: "product", 
        values: [{
          value: parentProduct,
          expressions: [parentProduct.toLowerCase(),
          productValue.toLowerCase()]
        }]
      };
      let url1 = config.apiUrlWitEntities;
     
      var result = await this.http.PostJsonAsync(url1, entitiesAdd,this.http.headersWit);
      
      if (result == null || result == undefined || result.id == null || result.id == undefined)
        await this.clearEntitiesMoo(paraSql);
    }
    catch (e) {
      console.log(e);
    }
  }

  async wit_CreatKeyword(product: any, productValue:any, parentProduct: any,
     resultCheck: any, paraSql: any,config:any) {
    try {
      console.log("cretae keyword");
      let entitiesUpdate = {
        value: parentProduct.toLowerCase(),
        expressions: [productValue.toLowerCase()],
        metadata: productValue.toLowerCase()
      };
      let url = config.apiUrlWitEntities + "/product/values";
      
      var result = await this.http.PostJsonAsync(url, entitiesUpdate, this.http.headersWit);
      if (result == null || result == undefined || result.id == null || result.id == undefined)
        await this.clearEntitiesMoo(paraSql);
    } catch (e) { console.log(e); }
  }


  async wit_AddSynonym(product: any,productValue:any, parentProduct: any, 
    resultCheck: any, paraSql: any,config:any) {
    try {
      console.log("addsynonym");
      var synoAdd = {
        values: resultCheck.values
      }
      let urlSyno = config.apiUrlWitEntities + "/product";
     
      var result = await this.http.PutJsonAsync(urlSyno, synoAdd, this.http.headersWit);
      if (result == null || result == undefined || result.id == null || result.id == undefined)
        await this.clearEntitiesMoo(paraSql);

    } catch (e) { console.log(e); }
  }

  // insert to sql
  async clearEntitiesMoo(paraCheck: any) {
    try {

      var configCheck = {
        mongoconnect: "ConnAi", mongodb: "AiDb", collectionname: "WitEntities",
        type: "procedure"
      };

      var jsonCheck = { config: JSON.stringify(configCheck), para: JSON.stringify(paraCheck) };

      //  let result = await this.service.PostFormSync(this.service.Api, jsonCheck, this.service.headersForm);
      // // console.log(result);
    } catch (e) { console.log(e); }
  }

}
