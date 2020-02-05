import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers: [ArtistService, UserService]
})
export class ArtistAddComponent implements OnInit{
    public title: string;
    public artists: Array<Artist>;
    public identity;
    public token;
    public url:string;
    public artist: Artist;
    public alertMessage;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.title = 'Add new artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','', '');
    }
    ngOnInit() {
        
    }
    onSubmit () {
        this._artistService.addArtist(this.token, this.artist).subscribe(response=>{
            let res:any = response;
            let artist = res.artist;
            if (!artist){
                this.alertMessage = 'oops, server error'
            } else {
                this.alertMessage = 'artist added succesfully'
                this.artist = artist;
                this._router.navigate(['/edit-artist', this.artist._id])
            }
        },
        error => {
            if (error != null){
                this.alertMessage =error.error.message;
            }
          });
    }
}
