import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { AlbumService } from '../services/album.service';


@Component({
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers: [ArtistService, UserService, AlbumService]
})
export class ArtistDetailComponent implements OnInit{
    public title: string;
    public artists: Array<Artist>;
    public identity;
    public token;
    public url:string;
    public artist: Artist;
    public albums: Array<Album>;
    public alertMessage;
    public confirm;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ){
        this.title = 'Edit artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','', '');
    }
    ngOnInit() {
    this.getArtist()
    }
    getArtist() {
        this._route.params.forEach((param: Params) => {
            let id = param['id'];

            this._artistService.getArtist(this.token, id).subscribe(response => {
                let res:any = response;
                let artist = res.artist;

                if (!artist) {
                    this._router.navigate(['/']);
                } else {
                    this.artist = artist;
                    this._albumService.getAlbums(this.token, artist._id).subscribe(response => {
                        let res:any = response;
                        let albums = res.albums;

                        if (!albums) {
                            this.alertMessage = 'this artist does not have any album yet'
                        } else {
                            this.albums = albums;
                        }
                    },
                    error => {
                        if (error != null){
                            alert(error.error.message);
                        }
                    });
                }
            },
            error => {
                if (error != null){
                    alert(error.error.message);
                }
              });
        })
    }
    onDeleteConfirm (id) {
        this.confirm = id;
    }
    onCancelAlbum (){
        this.confirm = null;
    }
    onDeleteAlbum (id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(response => {
            let res:any = response;
            let album = res.album;

            if (!album) {
                console.log('error deleting album');
                
            } else {
                this.getArtist();
            }
        },
        error => {
            if (error != null){
                alert(error.error.message);
            }
          });
    }
}
