export class User {
  public firstname: string;
  public lastname: string;
  public email: string;
  public avatarUrl: string;
  public creationDate: Date;
  public preferredLang: string;
  public occupation: string;
  public connected = false;

  public constructor(data: any = {}) {
    this.firstname = data.firstname || '';
    this.lastname = data.lastname || '';
    this.email = data.email || '';
    this.avatarUrl = data.avatarUrl || '';
    this.occupation = data.occupation || '';
    this.creationDate = data.creation_date || null;
    this.preferredLang = data.preferredLang || null;
    this.connected = data.connected || false;
  }

  public getName() {
    return this.firstname + ' ' + this.lastname;
  }
}
