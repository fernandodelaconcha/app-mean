import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.services';
import { Artist } from '../models/artist';


@Component({
  selector: 'artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [ArtistService, UserService]
})
export class ArtistListComponent implements OnInit{
    public title: string;
    public artists: Array<Artist>;
    public identity;
    public token;
    public url:string;
    public nextPage;
    public prevPage;
    public confirm;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.title = 'Artists';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.nextPage=1;
        this.prevPage=1;
    }
    ngOnInit() {
        this.getArtists()
    }

    getArtists(){
        this._route.params.forEach((params: Params) => {
            let page = +params['page?'];
            if (!page) {
                page = 1
            } else {
                this.nextPage = page+1
                this.prevPage = page-1

                if (this.prevPage == 0) {
                    this.prevPage = 1
                }
            }
            this._artistService.getArtists(this.token, page)
            .subscribe(
                response => {
                    let res:any = response;
                    let artists = res.artists;
                    if (!artists){
                        console.log('oops, server error')
                    } else {
                        this.artists = artists;
                    }
                },
                error => {
                    if (error != null){
                        console.log(error.error.message);
                    }
                  });
        })
    }
    onDeleteConfirm (id) {
        this.confirm = id;
    }
    onCancelArtist (){
        this.confirm = null;
    }
    onDeleteArtist (id) {
        this._artistService.deleteArtist(this.token, id).subscribe(response => {
            let res:any = response;
            let artist = res.artist;

            if (!artist) {
                console.log('error deleting artist');
                
            } else {
                this.getArtists();
            }
        },
        error => {
            if (error != null){
                alert(error.error.message);
            }
          });
    }
}
