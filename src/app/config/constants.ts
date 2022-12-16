import { Injectable } from '@angular/core'; 

@Injectable() 
export class Constants {
    public readonly SITE_NAME: string = "https://sitename.ru/";
    public readonly BACKEND_URL: string = "https://sitename.ru/api";
    public readonly EMAIL_PATTERN: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    public readonly SECRET_WORD: string = "secretword";
}