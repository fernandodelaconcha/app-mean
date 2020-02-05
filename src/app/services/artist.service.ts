import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { GLOBAL} from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService {
  public url: string;
  public identity;
  public token;

  constructor(private _http: HttpClient){
      this.url = GLOBAL.url;
  }

  getArtists(token, page) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(`${this.url}artists/${page}`, {headers});
  }

  getArtist(token, id:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(`${this.url}artist/${id}`, {headers});
  }

  addArtist(token, artist:Artist) {
    let params = JSON.stringify(artist);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.post(`${this.url}artist`, params, {headers});
  }

  editArtist(token,id, artist:Artist) {
    let params = JSON.stringify(artist);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(`${this.url}artist/${id}`, params, {headers});
  }

  deleteArtist(token, id:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.delete(`${this.url}artist/${id}`, {headers});
  }

}
