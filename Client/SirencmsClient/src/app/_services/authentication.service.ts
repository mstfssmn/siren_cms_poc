import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { User } from '@/_models';
import { User } from '../_models/user';
import { ROOT_URL } from 'src/app/_Models/Config'  

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    
    login(username: string, password: string) {
        
        return this.http.post<any>(ROOT_URL + '/Auth/Login', { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes

                    let jwtData = user.token.split('.')[1];
                    let decodedJwtJsonData = window.atob(jwtData);
                    let decodedJwtData = JSON.parse(decodedJwtJsonData);

                    let isAdmin = decodedJwtData.role;

                    console.log('jwtData: ' + jwtData);
                    console.log('decodedJwtJsonData: ' + decodedJwtJsonData);
                    console.log('decodedJwtData: ' + decodedJwtData);
                    console.log('Is admin: ' + isAdmin);
                    user.roleList = decodedJwtData.role;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}