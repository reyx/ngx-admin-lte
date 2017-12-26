import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {
  public modelName: string;
  public headers: HttpHeaders;
  private serverWithApiUrl: string;

  // cache data
  public lastGetAll: Array<any>;
  public lastGet: any;

  constructor(private http: HttpClient) {
    this.modelName = 'to-configure';

    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public setApiUrl(url: string) {
    this.serverWithApiUrl = url;
  }

  // HELPERS
  public getAllFromLS(maxtime = 0): Array<any> {
    const json = localStorage.getItem('rest_all_' + this.modelName);
    if (json) {
      const obj = JSON.parse(json);
      if (obj && obj.date < Date.now() - maxtime) {
        return obj;
      }
    }
  }

  public getFromCache(id): any {
    if (this.lastGetAll) {
      return this.lastGetAll.find(unit => unit.id === id);
    } else {
      return null;
    }
  }

  private getActionUrl() {
    return this.serverWithApiUrl + this.modelName + '/';
  }

  // REST functions
  public getAll(): Observable<any[]> {
    return this.http
      .get(this.getActionUrl(), { headers: this.headers })
      .map((response: Response) => {
        // getting an array having the same name as the model
        const data = response.json()[this.modelName];
        // transforming the array from indexed to associative
        const tab = data.records.map(elem => {
          const unit = {};
          // using the columns order and number to rebuild the object
          data.columns.forEach((champ, index) => {
            unit[champ] = elem[index];
          });
          return unit;
        });
        this.lastGetAll = tab;
        const obj = {
          data: tab,
          date: Date.now(),
        };
        localStorage.setItem('rest_all_' + this.modelName, JSON.stringify(obj));
        return tab;
      })
      .catch(this.handleError);
  }

  public get(id: number): Observable<any> {
    return this.http
      .get(this.getActionUrl() + id, { headers: this.headers })
      .map((response: Response) => {
        const data = response.json();
        this.lastGet = data;
        return data;
      })
      .catch(this.handleError);
  }

  public add(item: any): Observable<number> {
    const toAdd = JSON.stringify(item);

    return this.http
      .post(this.getActionUrl(), toAdd, { headers: this.headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public addAll(tab: Array<any>): Observable<Array<number>> {
    const toAdd = JSON.stringify(tab);

    return this.http
      .post(this.getActionUrl(), toAdd, { headers: this.headers })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public update(id: number, itemToUpdate: any): Observable<number> {
    return this.http
      .put(this.getActionUrl() + id, JSON.stringify(itemToUpdate), {
        headers: this.headers,
      })
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public delete(id: number): Observable<HttpResponse<any>> {
    return this.http
      .delete(this.getActionUrl() + id, { headers: this.headers })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return Observable.throw(error.error || 'Server error');
  }
}
