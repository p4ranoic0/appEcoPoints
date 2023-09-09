import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanjearService {
  constructor(private http: HttpClient) {}

  canjearRecompensas(carritoData: any[]) {
    const ruta = 'https://ecopoints.online/servicios/canjear.php';
    return this.http.post<any[]>(ruta, carritoData).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
