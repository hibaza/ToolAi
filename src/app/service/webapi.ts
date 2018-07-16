import { Injectable, Inject } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WebApiService {

    public headersForm: Headers;
    public headersJson: Headers;
    public headersWit: Headers;
    constructor(private http: Http) {
        this.headersForm = new Headers();
        this.headersForm.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        this.headersJson = new Headers();
        this.headersJson.append('Content-Type', 'application/json; charset=UTF-8');

        this.headersWit = new Headers();
        this.headersWit.append('Content-Type', 'application/json');
        //this.headersWit.append('Authorization', this.apiAuthorizationWit);
    }


    async PostFormSync(apiUrl: any, JsonPara: any, head: any): Promise<any> {
        try {
            let data = await this.http.post(apiUrl, this.serializeObj(JsonPara), {
                headers: head
            }).toPromise();
            return data.json();
        } catch (e) { console.log(e); return null; }
    }


    async PostJsonAsync(apiUrl: any, JsonPara: any, head: any): Promise<any> {
        try {
            let data = await this.http.post(apiUrl, JSON.stringify(JsonPara), {
                headers: head
            }).toPromise();
            return data.json()
        } catch (e) { console.log(e); return null; }
    }

    async PutJsonAsync(apiUrl: any, JsonPara: any, head: any): Promise<any> {
        try {            
            let data = await this.http.put(apiUrl, JSON.stringify(JsonPara), {
                headers: head
            }).toPromise()
            return data.json();
        } catch (e) { console.log(e); return null; }
    }


    async  GetDataSync(apiUrl: any, head: any): Promise<any> {
        try {
            let data = await this.http.get(apiUrl, { headers: head }).toPromise();
            return data.json();
        } catch (e) { console.log(e); return null; }

    }

    replaceString(value: string, expr: any, arg2: string): any {
        if (!value)
            return value;

        return value.replace(new RegExp(expr, 'gi'), arg2);
    }

    async  GetFileJsonSync(apiUrl: any): Promise<any> {
        try {
            let data = await this.http.get(apiUrl).toPromise();
            return data.json();
        } catch (e) { console.log(e); return null; }

    }

    async getFileJson(url:any): Promise<any> {

       var data= await this.http.get(url).toPromise();
       console.log(data);
        return data.json();//Promise.resolve(config);
    }

    serializeObj(obj: any) {
        try {
            var result = [];
            for (var property in obj)
                result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

            return result.join("&");
        } catch (e) { console.log(e); return null; }
    }

    async postFile(files: FileList, uri: any) {

        try {

            const formData: FormData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append(files[i].name, files[i]);
            }

            var data = await this.http.post(uri, formData).toPromise();
           
            return data.json();

        } catch (e) { console.log(e); }
        return null;
    }

}

