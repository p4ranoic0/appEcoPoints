import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  usuariosAll() {
    const ruta = 'https://ecopoints.online/servicios/usuarios.php';
    return this.http.get(ruta);
  }
  usuarioInsert(
    email: string,
    nombres: string,
    direccion: string,
    puntos: string,
    estado: string,
    rol: boolean | any
  ) {
    const ruta = 'https://ecopoints.online/servicios/insertarUsuario.php';
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('nombres', nombres);
    formData.append('direccion', direccion);
    formData.append('puntos', puntos);
    formData.append('estado', estado);
    formData.append('rol', rol);

    return this.http.post(ruta, formData).pipe(
      map((res) => {
        return res;
      })
    );
  }
  usuarioUpdate(
    id: string,
    email: string,
    nombres: string,
    direccion: string,
    puntos: string,
    estado: string,
    rol: boolean | any
  ) {
    const ruta = 'https://ecopoints.online/servicios/editarUsuario.php';
    const formData: FormData = new FormData();

    formData.append('id', id);
    formData.append('email', email);
    formData.append('nombres', nombres);
    formData.append('direccion', direccion);
    formData.append('puntos', puntos);
    formData.append('estado', estado);
    formData.append('rol', rol);

    return this.http.post(ruta, formData);
  }
  usuarioDelete(id: string) {
    const ruta = 'https://ecopoints.online/servicios/eliminarUsuario.php';
    const formData: FormData = new FormData();
    formData.append('id', id);

    return this.http.post(ruta, formData);
  }
}
