import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Mision } from 'src/app/entities/mision';
import { MisionesService } from 'src/app/services/misiones.service';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Usuario } from 'src/app/entities/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css'],
})
export class AdminUsuariosComponent {
  listaUsuarios: Usuario[] | undefined;

  usuarioAgregarForm = new FormGroup({
    email: new FormControl(),
    nombres: new FormControl(),
    direccion: new FormControl(),
    puntos: new FormControl(),
    estado: new FormControl(),
    Rol: new FormControl(),
  });
  nuevoUsuario: any = {};
  faEdit = faEdit;
  faTimes = faTimes;

  usuarioActualizarForm = new FormGroup({
    id: new FormControl(),
    email: new FormControl(),
    nombres: new FormControl(),
    direccion: new FormControl(),
    puntos: new FormControl(),
    estado: new FormControl(),
    rol: new FormControl(),
  });
  usuarioActualizar: Usuario | undefined;

  constructor(private usuarioService: UsuarioService) {}
  ngOnInit(): void {
    this.getUsuarios();
  }
  getUsuarios(): void {
    this.usuarioService.usuariosAll().subscribe((res: Usuario[] | any) => {
      this.listaUsuarios = res;
      console.log(res);
    });
  }
  agregarUsuario(values: any): void {
    this.usuarioService
      .usuarioInsert(
        values.email,
        values.nombres,
        values.direccion,
        values.puntos,
        (values.estado = 'ACTIVO'),
        (values.rol = 0)
      )
      .subscribe((res) => {
        this.nuevoUsuario = {
          id: values.id,
          email: values.email,
          nombres: values.nombres,
          direccion: values.direccion,
          puntos: values.puntos,
          estado: values.estado,
          rol: values.rol,
        };
        this.listaUsuarios?.push(this.nuevoUsuario);
        this.usuarioAgregarForm.reset();
        this.getUsuarios();
      });
  }
  editarUsuario(filaUsuario: Usuario): void {
    this.usuarioActualizar = filaUsuario;
  }
  actualizarUsuario(values: any): void {
    this.usuarioService
      .usuarioUpdate(
        values.id,
        values.email,
        values.nombres,
        values.direccion,
        values.puntos,
        values.estado,
        values.rol
      )
      .subscribe(() => {
        document.getElementById('botonCerrar')?.click();
        this.getUsuarios();
      });
  }
  eliminarUsuario(filaUsuario: Usuario): void {
    const respuesta = confirm(
      '¿Está seguro de que desea eliminar ' + filaUsuario.nombres + '?'
    );
    if (respuesta === true) {
      this.usuarioService.usuarioDelete(filaUsuario.id).subscribe(() => {
        this.listaUsuarios = this.listaUsuarios?.filter(
          (item: Usuario) => item.id !== filaUsuario.id
        );
        alert('Se ha eliminado la usuario: ' + filaUsuario.nombres);
      });
    }
  }
}
