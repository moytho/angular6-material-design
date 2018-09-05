import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { map } from "rxjs/operators";

@Injectable()
export class PhotoService{

    constructor(private http: Http) {
    
    }

    upload (customerId, photo){
        var formData = new FormData();
        formData.append('logo', photo);
        return this.http.post('http://api.trans-pezza.com/api/customers/savelogo/' + customerId, formData)
        .pipe(
            map(res => { 
                return res.json();
            })
        );
    }
}