import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Mision } from 'src/app/entities/mision';
import { MisionesService } from 'src/app/services/misiones.service';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-mision',
  templateUrl: './admin-mision.component.html',
  styleUrls: ['./admin-mision.component.css'],
})
export class AdminMisionComponent implements OnInit {
  listaMisiones: Mision[] | undefined;

  misionAgregarForm = new FormGroup({
    titulo: new FormControl(),
    descripcion: new FormControl(),
    puntos: new FormControl(),
  });

  nuevaMision: any = {};

  faEdit = faEdit;
  faTimes = faTimes;

  misionActualizarForm = new FormGroup({
    idmisiones: new FormControl(),
    titulo: new FormControl(),
    descripcion: new FormControl(),
    puntos: new FormControl(),
  });

  misionActualizar: Mision | undefined;

  constructor(private misionService: MisionesService) {}

  ngOnInit(): void {
    this.getMisiones();
  }

  getMisiones(): void {
    this.misionService.getMisiones().subscribe((res: Mision[] | any) => {
      this.listaMisiones = res;
    });
  }

  agregarMision(values: any): void {
    this.misionService
      .misionInsert(values.titulo, values.descripcion, values.puntos)
      .subscribe((res) => {
        this.nuevaMision = {
          idmisiones: values.idmisiones,
          titulo: values.titulo,
          descripcion: values.descripcion,
          puntos: values.puntos,
        };
        this.listaMisiones?.push(this.nuevaMision);
        this.misionAgregarForm.reset();
        this.getMisiones();
      });
  }

  editarMision(filaMision: Mision): void {
    this.misionActualizar = filaMision;
  }

  actualizarMision(values: any): void {
    this.misionService
      .misionUpdate(
        values.idmisiones,
        values.titulo,
        values.descripcion,
        values.puntos
      )
      .subscribe(() => {
        document.getElementById('botonCerrar')?.click();
        this.getMisiones();
      });
  }

  eliminarMision(filaMision: Mision): void {
    const respuesta = confirm(
      '¿Está seguro de que desea eliminar ' + filaMision.titulo + '?'
    );
    if (respuesta === true) {
      this.misionService.misionDelete(filaMision.idmisiones).subscribe(() => {
        this.listaMisiones = this.listaMisiones?.filter(
          (item: Mision) => item.idmisiones !== filaMision.idmisiones
        );
        alert('Se ha eliminado la misión: ' + filaMision.titulo);
      });
    }
  }
}
