export class Utente {

    private photoPath: string;
    private nome: string;
    private cognome: string;
    private numero: string = '';
    private email: string = '';
    private admin: boolean;
    private id: string = "";
    private social: {} = {};
    private firstAccess: boolean;
    private pin: string = "";
    private callId: string = "";


    constructor(id: string, nome: string, cognome: string, numero: string, email: string, photoPath: string, callId: string) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.numero = numero;
        this.email = email;
        this.photoPath = photoPath;
        this.admin = false;
        this.firstAccess = true;
        this.social["facebook"] = null;
        this.social["google"] = null;
        this.social["instagram"] = null;
        this.social["linkedin"] = null;
        this.social["telegram"] = null;
        this.social["twitter"] = null;
        this.social["whatsapp"] = null;
        this.social["youtube"] = null;
        this.callId = callId;
    }




    public getPhotoPath() {
        return this.photoPath;
    }

    public setPhotoPath(photoPath: string) {
        this.photoPath = photoPath
    }

    public getNome() {
        return this.nome;
    }

    public setNome(nome: string) {
        this.nome = nome;
    }

    public getCognome() {
        return this.cognome;
    }

    public setCognome(cognome: string) {
        this.cognome = cognome;
    }

    public getNumero() {
        return this.numero;
    }

    public setNumero(numero: string) {
        this.numero = numero;
    }

    public getEmail() {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public isAdmin() {
        return this.admin;
    }

    public setAdmin() {
        this.admin = true;
    }

    public getId() {
        return this.id;
    }

    public setId(id: string) {
        this.id = id;
    }

    public addSocial(social: string, nomeSocial: string) {
        this.social[nomeSocial] = social;
    }

    public removeSocial(social: string, nomeSocial: string) {
        this.social[nomeSocial] = null;
    }

    public changeSocial(social: string, nomeSocial: string) {
        this.social[nomeSocial] = social;
    }

    public isFirstAccess() {
        return this.firstAccess;
    }

    public setFirstAccess(firstAccess: boolean) {
        this.firstAccess = firstAccess;
    }

    public getPin() {
        return this.pin;
    }

    public setPin(pin: string) {
        this.pin = pin;
    }

    public getCallId() {
        return this.callId;
    }

    public setCallId(callId) {
        this.callId = callId;
    }

    public getSocial(social) {
        return this.social[social];
    }

}