import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from '../services/global';
import { Song } from '../models/song'
import { UserService } from '../services/user.services';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url:string;
    public alertMessage;
    public song: Song;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ){
        this.title = 'Edit Song';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('',1,'', '', '', '');
        this.is_edit = true;
    }
    ngOnInit() {
        this._route.params.forEach((param: Params) => {
            let id = param['id'];

            this._songService.getSong(this.token, id).subscribe(response => {
                let res:any = response;
                let song = res.song;

                if (!song) {
                    this._router.navigate(['/']);
                } else {
                    this.song = song;
                }
            },
            error => {
                if (error != null){
                    this.alertMessage =error.error.message;
                }
              });
        })
    }
    onSubmit(){
        this._songService.editSong(this.token,this.song._id, this.song).subscribe(response=>{
            let res:any = response;
            let song = res.song;
            if (!song){
                this.alertMessage = 'oops, server error'
            } else {
                this.alertMessage = 'song editted succesfully'
                this._uploadService.makeFileRequest(`${this.url}upload-file-song/${this.song._id}`, [],this.filesToUpload, this.token, 'file')
                    .then(result => {
                    }, 
                    error => {
                        console.log(error)
                    })
            }
        },
        error => {
            if (error != null){
                this.alertMessage =error.error.message;
            }
          });
    }
    fileChangeEvent (fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
