import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemCanje } from 'src/app/entities/itemCanje';
import { Recompensa } from 'src/app/entities/recompensa';
import { RecompensaService } from 'src/app/services/recompensa.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-recompensas',
  templateUrl: './recompensas.component.html',
  styleUrls: ['./recompensas.component.css'],
})
export class RecompensasComponent implements OnInit {
  listaRecompensa: Recompensa[] | undefined;
  constructor(
    private recompensaService: RecompensaService,
    private toastService: ToastService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.recompensaService.recompensasAll().subscribe((res) => {
      this.listaRecompensa = JSON.parse(JSON.stringify(res));
    });
  }
  agregarCarrito(item: Recompensa) {
    this.toastService.showSuccessToast('Mensaje', 'Item agregado');
    let iCarrito: ItemCanje = {
      idrecompensa: item.id,
      nombre: item.nom_recompensa,
      puntos: Number(item.puntos_recompensa),
      cantidad: 1,
      img: item.img_recompensa,
      subtotal: Number(item.puntos_recompensa), // Calcular el subtotal como el valor inicial de los puntos
    };
    if (localStorage.getItem('carrito') === null) {
      // Cuando el carrito está vacío
      let carrito: ItemCanje[] = [];
      carrito.push(iCarrito);
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
      let carritoStorage = localStorage.getItem('carrito') as string;
      let carrito = JSON.parse(carritoStorage);
      let index = -1;
      for (let i = 0; i < carrito.length; i++) {
        let itemC: ItemCanje = carrito[i];
        if (iCarrito.idrecompensa === itemC.idrecompensa) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        carrito.push(iCarrito);
        localStorage.setItem('carrito', JSON.stringify(carrito));
      } else {
        let itemCarrito: ItemCanje = carrito[index];
        itemCarrito.cantidad!++;
        itemCarrito.subtotal = itemCarrito.puntos * itemCarrito.cantidad; // Calcular el subtotal actualizado
        carrito[index] = itemCarrito;
        localStorage.setItem('carrito', JSON.stringify(carrito));
      }
    }
  }
}
