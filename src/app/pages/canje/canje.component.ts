import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { ItemCanje } from 'src/app/entities/itemCanje';
import { CanjearService } from 'src/app/services/canjear.service';
import { RecompensaService } from 'src/app/services/recompensa.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-canje',
  templateUrl: './canje.component.html',
  styleUrls: ['./canje.component.css'],
})
export class CanjeComponent implements OnInit {
  listaItemsRecompensas: ItemCanje[] | any;
  totalItems: number = 0;
  totalPuntos: number = 0;
  userData: any; // Aquí almacenaremos el objeto con los datos del usuario logeado, asegúrate de obtenerlo correctamente.

  constructor(
    private canjearService: CanjearService,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let carritoStorage = localStorage.getItem('carrito') as string;
    let carrito = JSON.parse(carritoStorage);
    this.listaItemsRecompensas = carrito ? carrito : [];
    // Aquí debes obtener los datos del usuario logeado y almacenarlos en la variable userData
    // Por ejemplo, si tienes una variable en el localStorage llamada 'userData' con los datos del usuario:
    let userDataStorage = localStorage.getItem('userData');
    this.userData = JSON.parse(userDataStorage || '');

    this.calcularTotales();
  }

  vaciarCarrito() {
    localStorage.removeItem('carrito');
    this.listaItemsRecompensas = [];
    this.calcularTotales();
  }

  retirarItem(idrecompensa: string) {
    // Buscar el índice del item con el idrecompensa especificado en la lista de items del carrito
    const index = this.listaItemsRecompensas?.findIndex(
      (item: { idrecompensa: string }) => item.idrecompensa === idrecompensa
    );

    if (index !== -1) {
      // Eliminar el item del carrito
      this.listaItemsRecompensas?.splice(index, 1);

      // Eliminar el item del localStorage
      localStorage.setItem(
        'carrito',
        JSON.stringify(this.listaItemsRecompensas)
      );
      this.calcularTotales();
    }
  }

  calcularTotales() {
    this.totalItems = this.listaItemsRecompensas.reduce(
      (total: number, item: ItemCanje) => total + (item.cantidad || 0),
      0
    );

    this.totalPuntos = this.listaItemsRecompensas.reduce(
      (total: number, item: ItemCanje) =>
        total + (item.cantidad || 0) * (item.puntos || 0),
      0
    );
  }
  calcularSubtotal(item: ItemCanje) {
    item.subtotal = (item.puntos || 0) * (item.cantidad || 0);
    this.calcularTotales();
  }

  canjearPuntos() {
    if (this.totalPuntos > this.userData.puntos) {
      this.toastService.showErrorToast(
        'Error al Canjear',
        'Puntaje insuficiente'
      );
      return; // Finalizar la función si no hay suficientes puntos
    }
    // Obtener los datos del carrito para enviar al servicio
    const carritoData = this.listaItemsRecompensas.map((item: ItemCanje) => {
      return {
        idUsuario: this.userData.id, // Obtener el id del usuario desde donde lo tengas almacenado (por ejemplo, localstorage.userData)
        idRecompensa: item.idrecompensa,
        cantidad: item.cantidad,
        puntosCanjeados: item.subtotal,
      };
    });

    // Llamamos al servicio para realizar el canje
    this.canjearService.canjearRecompensas(carritoData).subscribe(
      (response) => {
        console.log(response); // Maneja la respuesta como consideres necesario (por ejemplo, mostrar un mensaje de éxito, etc.)
        // Buscar la respuesta que contiene el puntaje actualizado
        let puntajeActualizado;
        for (let i = response.length - 1; i >= 0; i--) {
          if (response[i].puntajeActualizado !== undefined) {
            puntajeActualizado = response[i].puntajeActualizado;
            break;
          }
        }

        if (puntajeActualizado !== undefined) {
          // Actualizar el valor del puntaje en el userData con el nuevo valor devuelto por el servicio
          this.userData.puntos = puntajeActualizado;
          localStorage.setItem('userData', JSON.stringify(this.userData));
          // Forzar la detección de cambios para actualizar la vista inmediatamente
          window.location.reload();
        }
        this.vaciarCarrito(); // Vaciar el carrito después de realizar el canje exitosamente
        this.toastService.showSuccessToast('Exito', 'Productos canjeados');
      },
      (error) => {
        console.error(error); // Maneja el error si ocurre alguno en el servicio
      }
    );
  }
}
