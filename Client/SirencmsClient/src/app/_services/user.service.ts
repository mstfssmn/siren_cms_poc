import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';
import { ROOT_URL } from 'src/app/_Models/Config'  

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(ROOT_URL +  '/users');
    }
    
    getById(id: number) {
        return this.http.get<User>(ROOT_URL + '/users/${id}');
    }
}