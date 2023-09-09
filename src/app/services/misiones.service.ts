import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MisionesService {
  constructor(private http: HttpClient) {}

  misionesAll() {
    const ruta = 'https://ecopoints.online/servicios/misiones.php';
    return this.http.get(ruta);
  }
  getMisiones() {
    const ruta = 'https://ecopoints.online/servicios/misiones.php';
    return this.http.get(ruta);
  }

  misionInsert(titulo: string, descripcion: string, puntos: string) {
    const ruta = 'https://ecopoints.online/servicios/insertarMision.php';
    const formData: FormData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('puntos', puntos);

    return this.http.post(ruta, formData).pipe(
      map((res) => {
        return res;
      })
    );
  }

  misionUpdate(
    idmisiones: string,
    titulo: string,
    descripcion: string,
    puntos: string
  ) {
    const ruta = 'https://ecopoints.online/servicios/editarMision.php';
    const formData: FormData = new FormData();
    formData.append('idmisiones', idmisiones);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('puntos', puntos);

    return this.http.post(ruta, formData);
  }

  misionDelete(idmisiones: string) {
    const ruta = 'https://ecopoints.online/servicios/eliminarMision.php';
    const formData: FormData = new FormData();
    formData.append('idmisiones', idmisiones);

    return this.http.post(ruta, formData);
  }
}
