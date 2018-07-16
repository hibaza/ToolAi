import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() { }

  removeUnikey(value)
  {
      var str= this.removeSpecialCharacters(value);;
     var text_create = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\ /g, '-').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g,"o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g,"i");
     return text_create;
  }

  replaceString(value: string, expr: any, arg2: string): any {
      if (!value)
          return value;
      var str= this.removeSpecialCharacters(value);
      return str.replace(new RegExp(expr, 'gi'), arg2);
  }

  removeSpecialCharacters(value:string)
  {
      var v =value.replace(new RegExp("\"", 'gi'), "");
      v =value.replace(new RegExp(".", 'gi'), "");
      v =value.replace(new RegExp(",", 'gi'), "");
      //var t= $.trim(v.replace(/[\t\n]+/g,' '));
      var k=  v.replace(/\s+/g," ");
      return k
  }
  extracNumber(value : string)
  {
      var numbs = value.match(/\d+/g);
      var num ="";
      numbs.forEach(element => {
          num+= element +"";
      });
      return num;
  }

}
