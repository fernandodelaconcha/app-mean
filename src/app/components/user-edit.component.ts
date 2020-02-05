import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.services';
import  {User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public filesToUpload: Array<File>;
    public url:string;

    constructor (private _userService: UserService) {
        this.title = 'edit user';
    }
    ngOnInit() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    onSubmit(){
        this._userService.updateUser(this.user).subscribe(response=>{
            let res:any = response;
            let user = res.user;
            if (!user){
                this.alertMessage = "could not update user";
            } else {
                document.getElementById('identity-name').innerHTML = this.user.name;
                localStorage.setItem('identity', JSON.stringify(this.user));
                if (this.filesToUpload){
                    this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then((result: any) => {
                        this.user.image = result.image;
                        document.getElementById('image-logged').setAttribute('src', this.url + 'get-image-user/' + this.user.image)
                        localStorage.setItem('identity', JSON.stringify(this.user));
                    })
                }
                this.alertMessage = "data updated succesfully";
            }
        },
        error=>{
            if (error != null){
                this.alertMessage=error.error.message;
            }
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        
    }
    makeFileRequest(url:string, params: Array<string>, files: Array<File>){
        var token = this.token;
        return new Promise(function(resolve, reject) {
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append('image',files[i],files[i].name);
                
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
