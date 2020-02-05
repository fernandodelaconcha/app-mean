import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }
    register (user_to_register){
        let json = JSON.stringify(user_to_register);
        let params = json;
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this._http.post(this.url+'register', params, {headers: headers})
    }
    login(user_to_login, getHash = null){
        if (getHash != null){
            user_to_login.getHash = getHash
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this._http.post(this.url+'login', params, {headers: headers})
    }

    updateUser (user_to_update) {
        let json = JSON.stringify(user_to_update);
        let params = json;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });
        return this._http.put(this.url+'update-user/'+user_to_update._id, params, {headers: headers})
    }
    getIdentity () {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != undefined) {
            this.identity = identity
        } else {
            this.identity = null
        }
        return this.identity
    }
    getToken () {
        let token = localStorage.getItem('token');
        if (token != undefined) {
            this.token = token
        } else {
            this.token = null
        }
        return this.token
    }
}