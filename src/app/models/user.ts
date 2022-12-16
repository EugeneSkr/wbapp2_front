export type roles = 'norole' | 'admin' | 'operator';

export interface iUser{
    id?: number,
    role?: roles,
    email: string,
    lastName: string,
    name: string,
    sureName: string,
    fio?: string,
    regTime?: string,
    regIp?: string,
    banned?: boolean,
    protected: boolean,
    options?: string
}

export interface iRegUser extends iUser{
    password: string,
    password2: string,
}