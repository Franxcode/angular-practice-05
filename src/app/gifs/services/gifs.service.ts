import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'JaPnVHEPaptUSygSTvTPmtb3xXJHvXfH';
  private _historial: string[] = [];

  // TODO: Cambiar any por su tipo correspondiente.
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultado')!) || [];
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  // async
  buscarGifs(query: string = '') {
    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultado', JSON.stringify(this.resultados));
      });
    // fetch(
    //   'https://api.giphy.com/v1/gifs/search?api_key=JaPnVHEPaptUSygSTvTPmtb3xXJHvXfH&q=dragon ball z&limit=10'
    // ).then((resp) => {
    //   resp.json().then((data) => console.log(data));
    // });

    // Utilizando async en la funcion*
    // const resp = await fetch(
    //   'https://api.giphy.com/v1/gifs/search?api_key=JaPnVHEPaptUSygSTvTPmtb3xXJHvXfH&q=dragon ball z&limit=10'
    // );
    // const data = await resp.json();
    // console.log(data);
  }
}
