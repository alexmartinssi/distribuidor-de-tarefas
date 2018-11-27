import { Injectable } from "@angular/core";
import { CredentialsDTO } from "../models/credentials.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService {
    constructor(public http: HttpClient, public storege: StorageService){

    }

    authenticate(creds: CredentialsDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    sucessfulLogin(authorizationValue: string){
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            token : tok
        };
        this.storege.setLocalUser(user);
    }

    logout(){
        this.storege.setLocalUser(null);
    }
}