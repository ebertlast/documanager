import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').attr('class', 'fixed-sidebar no-skin-config full-height-layout pace-done');
  }

}
