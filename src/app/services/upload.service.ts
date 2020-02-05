import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';
import { Artist } from '../models/artist';

    @Injectable()
    export class UploadService {
        makeFileRequest(url:string, params: Array<string>, files: Array<File>, token: string, name: string){
        return new Promise(function(resolve, reject) {
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append(name,files[i],files[i].name);
                
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if (xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response)
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData)
        });
    }
}