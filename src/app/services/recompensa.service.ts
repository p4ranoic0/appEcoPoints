import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecompensaService {
  constructor(private http: HttpClient) {}

  recompensasAll(): Observable<any> {
    const ruta = 'https://ecopoints.online/servicios/recompensa.php';
    return this.http.get(ruta);
  }

  recompensaInsert(
    nom_recompensa: string,
    puntos_recompensa: string,
    img_recompensa: string
  ): Observable<any> {
    const ruta = 'https://ecopoints.online/servicios/insertarRecompensa.php';
    const formData: FormData = new FormData();
    formData.append('nom_recompensa', nom_recompensa);
    formData.append('puntos_recompensa', puntos_recompensa);
    formData.append('estado', '1');
    formData.append('img_recompensa', img_recompensa);

    return this.http.post(ruta, formData);
  }

  recompensaUpdate(
    id: string,
    nom_recompensa: string,
    puntos_recompensa: string,
    img_recompensa: string
  ): Observable<any> {
    const ruta = 'https://ecopoints.online/servicios/editarRecompensa.php';
    const formData: FormData = new FormData();
    formData.append('id', id);
    formData.append('nom_recompensa', nom_recompensa);
    formData.append('puntos_recompensa', puntos_recompensa);
    formData.append('img_recompensa', img_recompensa);

    return this.http.post(ruta, formData);
  }

  recompensaDelete(id: string): Observable<any> {
    const ruta = 'https://ecopoints.online/servicios/eliminarRecompensa.php';
    const formData: FormData = new FormData();
    formData.append('id', id);

    return this.http.post(ruta, formData);
  }

  guardarImagen(imgFile: File): Observable<any> {
    const ruta = 'https://ecopoints.online/servicios/guardarImgRecompensa.php';
    const formData: FormData = new FormData();
    formData.append('img_recompensa', imgFile);

    return this.http.post(ruta, formData);
  }
}
