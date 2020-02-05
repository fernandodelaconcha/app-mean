import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';
import { UserService } from '../services/user.services';


@Component({
  selector: 'album-add',
  templateUrl: '../views/album-add.html',
  providers: [AlbumService, UserService]
})
export class AlbumAddComponent implements OnInit{
    public name: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url;
    public alertMessage;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
    ){
        this.name = 'Add album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','',2020,'','');
    }
    ngOnInit() {
    }

    onSubmit(){
        this._route.params.forEach((params: Params)=>{
            let artist_id = params['artist'];
            this.album.artist = artist_id;
        })

        this._albumService.addAlbum(this.token, this.album).subscribe(response=>{
            let res:any = response;
            let album = res.album;
            if (!album){
                this.alertMessage = 'oops, server error'
            } else {
                this.alertMessage = 'album added succesfully'
                this.album = album;
                this._router.navigate(['/edit-album', this.album._id])
            }
        },
        error => {
            if (error != null){
                this.alertMessage =error.error.message;
            }
          });
        
        
    }
}
