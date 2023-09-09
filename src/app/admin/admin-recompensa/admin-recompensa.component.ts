import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Recompensa } from 'src/app/entities/recompensa';
import { RecompensaService } from 'src/app/services/recompensa.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-admin-recompensa',
  templateUrl: './admin-recompensa.component.html',
  styleUrls: ['./admin-recompensa.component.css'],
})
export class AdminRecompensaComponent implements OnInit {
  listaRecompensas: Recompensa[] | undefined;
  imgRecompensaFileValue: string | undefined;

  recompensaAgregarForm = new FormGroup({
    id: new FormControl(),
    nom_recompensa: new FormControl(),
    puntos_recompensa: new FormControl(),
    img_recompensa: new FormControl(),
    img_recompensa_file: new FormControl(),
  });

  nuevaRecompensa: any = {};
  faEdit = faEdit;
  faTimes = faTimes;

  recompensaActualizarForm = new FormGroup({
    id: new FormControl(),
    nom_recompensa: new FormControl(),
    puntos_recompensa: new FormControl(),
    estado: new FormControl(),
    img_recompensa: new FormControl(),
    img_recompensa_file: new FormControl(),
  });
  recompensaActualizar: Recompensa | any;

  constructor(
    private recompensaService: RecompensaService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getRecompensa();
  }

  getRecompensa(): void {
    this.recompensaService
      .recompensasAll()
      .subscribe((res: Recompensa[] | any) => {
        this.listaRecompensas = res;
      });
  }

  agregarRecompensa(values: any): void {
    const imgFile = values.img_recompensa_file;
    // Verificar si se seleccionó una imagen
    if (imgFile instanceof File) {
      const imgName = imgFile.name; // Obtener el nombre del archivo

      this.recompensaService.guardarImagen(imgFile).subscribe((res: any) => {
        //console.log('Imagen guardada:', res);

        this.recompensaService
          .recompensaInsert(
            values.nom_recompensa,
            values.puntos_recompensa,
            imgName // Pasar el nombre del archivo en lugar de la ruta
          )
          .subscribe((res) => {
            this.nuevaRecompensa = {
              id: values.id,
              nom_recompensa: values.nom_recompensa,
              puntos_recompensa: values.puntos_recompensa,
              img_recompensa: imgName,
            };
            this.listaRecompensas?.push(this.nuevaRecompensa);
            this.recompensaAgregarForm.reset();
            this.getRecompensa();
          });
      });
    } else {
      alert('error');
    }
  }

  editarRecompensa(filaRecompensa: Recompensa): void {
    this.recompensaActualizar = filaRecompensa;
    this.recompensaActualizarForm.setValue({
      id: filaRecompensa.id,
      nom_recompensa: filaRecompensa.nom_recompensa,
      puntos_recompensa: filaRecompensa.puntos_recompensa,
      estado: filaRecompensa.estado,
      img_recompensa: filaRecompensa.img_recompensa,
      img_recompensa_file: '',
    });
  }

  actualizarRecompensa(values: any): void {
    if (values.img_recompensa_file.name != values.img_recompensa) {
      const imgFile = values.img_recompensa_file;
      this.recompensaService.guardarImagen(imgFile);
    }
    this.recompensaService
      .recompensaUpdate(
        values.id,
        values.nom_recompensa,
        values.puntos_recompensa,
        values.img_recompensa
      )
      .subscribe(() => {
        document.getElementById('botonCerrar')?.click();
        this.getRecompensa();
      });
  }

  eliminarRecompensa(filaRecompensa: Recompensa): void {
    const respuesta = confirm(
      '¿Está seguro de que desea eliminar ' +
        filaRecompensa.nom_recompensa +
        '?'
    );
    if (respuesta === true) {
      this.recompensaService
        .recompensaDelete(filaRecompensa.id)
        .subscribe(() => {
          this.listaRecompensas = this.listaRecompensas?.filter(
            (item: Recompensa) => item.id !== filaRecompensa.id
          );
          alert('Se ha eliminado la misión: ' + filaRecompensa.nom_recompensa);
        });
    }
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const fileName = file.name;
      this.recompensaAgregarForm.patchValue({
        img_recompensa_file: file,
        img_recompensa: fileName,
      });
    }
  }
  onFileSelectedUpdate(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const fileName = file.name;
      this.recompensaActualizarForm.patchValue({
        img_recompensa_file: file,
        img_recompensa: fileName,
      });
    }
  }
}
