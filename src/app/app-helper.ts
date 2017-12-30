import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';
declare var Snackbar: any;
declare var $: any;
declare var toastr: any;
declare var ion: any;
@Injectable()
export class Helper {
  constructor(private _location: Location) { }
  // constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
  //   toastr.setRootViewContainerRef(vcr);
  // }
  /**
   * Despliegue de mensajes tipo notificaciones >> https://notifyjs.com/
   * @param message Mensaje que se mostrará en el cuerpo de la notificación
   * @param type Tipo de notificación: success [default] (verde), error (rojo), warning (amarillo), info (azul))
   * @param divId Identificador del control
   * @param autoHide Destruir automáticamente el mensaje
   * @param position Posición de la pantalla donde se desplegará la notificación: top-right, bottom-right  (Default), bottom-left,
   * top-full-width, bottom-full-width, top-center, bottom-center
   */
  public Notificacion(message: string, type = 'success', divId = '', autoHide = true, position = 'top right'): void {
    const options = {
      // whether to hide the notification on click
      clickToHide: true,
      // whether to auto-hide the notification
      autoHide: autoHide,
      // if autoHide, hide after milliseconds
      autoHideDelay: 5000,
      // show the arrow pointing at the element
      arrowShow: true,
      // arrow size in pixels
      arrowSize: 5,
      // position defines the notification position though uses the defaults below
      position: position,
      // default positions
      elementPosition: 'bottom left',
      globalPosition: 'top right',
      // default style
      style: 'bootstrap',
      // default class (string or [string])
      className: type,
      // show animation
      showAnimation: 'slideDown',
      // show animation duration
      showDuration: 400,
      // hide animation
      hideAnimation: 'slideUp',
      // hide animation duration
      hideDuration: 200,
      // padding between element and notification
      gap: 2
    };
    // console.log(message);
    switch (type) {
      case 'success':
        this.Sonido();
        break;
      case 'error':
        this.Sonido('computer_error');
        break;
      case 'warning':
        this.Sonido('snap');
        break;
      case 'info':
        // this.Sonido('water_droplet');
        break;
      default:
        this.Sonido();
    }
    if (divId === '') {
      $.notify(message, options);
    } else {
      $('#' + divId).notify(message, options);
    }
  }

  /**
   * Aplica efectos de animaciones a un div
   * @param idDiv Identificador del div donde se va a realizar la animacióm
   * @param animation Nombre de la animación, que puede encontrarse en la documentacion https://github.com/daneden/animate.css
   */
  public AnimarDiv(idDiv: string, animation: string = 'shake') {

    $('#' + idDiv)
      .removeClass()
      .addClass(animation + ' animated')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass();
      });
  }

  /**
   * Cambia de color principal a toda la plantilla
   * @param color Color a ser utilizado. Opciones: blue, brown, cyan, deep-orange, deep-purple, green, grey, indigo, light-blue,
   * light-green, lime, orange, pink, purple, red, teal, yellow. Valor por defecto: light-blue
   * @param tonalidad Oscuridad de la tonalidad. Opciones: 300, 400, 500, 600, 700. Valor por Defecto: 500
   */
  public CambiarColorTema(color: string = 'light-blue', tonalidad: number = 500) {
    $('#theme').attr('href', 'assets/css/style.' + color + '-' + tonalidad.toString() + '.min.css')
  }

  /**
   * Tarda un determinado tiempo para ejecutar una acción, ejemplo:
   * this.sleep(1500).then(() => {
   *   console.log(' Do something after the sleep!');
   * });
   */
  public Sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  public PaginaAnterior() {
    this._location.back();
  }

  public Capitalizar(s) {
    return s.toLowerCase().replace(/(^|\s)[a-z]/g, function (a) { return a.toUpperCase(); });
  }

  public FechaMayorQue(fechaInicial: Date, fechaFinal: Date): boolean {
    // console.log(fechaInicial, fechaFinal);
    // Verificamos que la fecha no sea posterior a la actual
    const dateStart = fechaInicial;
    const dateEnd = fechaFinal;
    if (dateStart >= dateEnd) {
      return true;
    }
    return false;
  }

  /**
   * Posiciona el cursor hasta el principio de la página actual
   */
  public ScrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }

  public ExcelReport(tabid: string) {
    let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    let textRange;
    let j = 0;
    // const tab = document.getElementById('headerTable'); // id of table
    let tab: any;
    tab = document.getElementById(tabid); // id of table

    for (j = 0; j < tab.rows.length; j++) {
      tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
      // tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    let txtArea1: any;
    let sa: any;
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
      txtArea1.document.open("txt/html", "replace");
      txtArea1.document.write(tab_text);
      txtArea1.document.close();
      txtArea1.focus();
      sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
    }
    else                 //other browser not tested on IE 11
      sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);
  }

  /**
   * Reproduce efectos de sonidos para ser utilizados en botones y acciones de ventanas.
   * Documentación: http://ionden.com/a/plugins/ion.sound/en.html, https://github.com/IonDen/ion.sound
   * @param audioName Nombre del audio a reproducir. Valor por defecto: branch_break, opciones: [button_tiny, computer_error, glass, water_droplet, snap, branch_break]
   */
  public Sonido(audioName: string = 'branch_break') {
    ion.sound.play(audioName);
  }


  public ExportarExcel2(data: any) {
    // console.log(data);
    let columnas: string[] = [];
    for (var i = 0; i < 1; i++) {
      for (let key in data[i]) {
        columnas.push(key);
      }
    }
    // console.log(columnas);

    // let tab: any;
    // var textRange;
    var j = 0;
    // tab = document.getElementById('tablaFiltros'); // id of table

    var tab_text = "<table border='2px'>";
    // var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    // for (j = 0; j < tab.rows.length; j++) {
    //   tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    //   //tab_text=tab_text+"</tr>";
    // }
    tab_text = tab_text + "<tr bgcolor='#87AFC6'>";
    columnas.forEach(titulo => {
      tab_text = tab_text + "<td>" + titulo + "</td>";
    });
    tab_text = tab_text + "</tr>";


    tab_text = tab_text + "</table>";
    // // tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    // // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    // // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
    console.log(tab_text);
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf("MSIE ");
    let sa: any;
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
      const txtArea1 = $('#txtAreaExportExcel');
      txtArea1.document.open("txt/html", "replace");
      txtArea1.document.write(tab_text);
      txtArea1.document.close();
      txtArea1.focus();
      sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Submit");
    } else { // other browser not tested on IE 11
      sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
    }

    return (sa);
  }

  public ExportarExcelBAD(e, data) {
    console.log(e);
    const dt = new Date();
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();
    const hour = dt.getHours();
    const mins = dt.getMinutes();
    const postfix = day + '.' + month + '.' + year + '_' + hour + '.' + mins;
    // creating a temporary HTML link element (they support setting file names)
    const a = document.createElement('a');
    // getting data from our div that contains the HTML table
    const data_type = 'data:application/vnd.ms-excel';


    // var table_div = document.getElementById('dvData');
    // var table_html = table_div.outerHTML.replace(/ /g, '%20');

    /******************************************************* */
    const columnas: string[] = [];
    for (let i = 0; i < 1; i++) {
      for (let key in data[i]) {
        columnas.push(key);
      }
    }
    const j = 0;
    let tab_text = "<table border='2px'>";
    tab_text = tab_text + "<tr bgcolor='#87AFC6'>";
    columnas.forEach(titulo => {
      tab_text = tab_text + "<td>" + titulo + "</td>";
    });
    tab_text = tab_text + "</tr>";
    tab_text = tab_text + "</table>";
    const table_html = tab_text;
    /******************************************************** */
    a.href = data_type + ', ' + table_html;
    // setting the file name
    a.download = 'exported_table_' + postfix + '.xls';
    // triggering the function
    a.click();
    // just in case, prevent default behaviour
    e.preventDefault();

  }

  public ExportarExcel(data) {
    console.log(data);
    /******************************************************* */
    // #region Columnas
    let columnas: string[] = [];
    for (var i = 0; i < 1; i++) {
      for (let key in data[i]) {
        columnas.push(key);
      }
    }
    var j = 0;
    var tab_text = "<table border='2px'>";
    tab_text = tab_text + "<tr bgcolor='#87AFC6'>";
    columnas.forEach(titulo => {
      tab_text = tab_text + "<th>" + titulo + "</th>";
    });
    tab_text = tab_text + "</tr>";
    // #endregion
    for (var i = 0; i < data.length; i++) {
      tab_text = tab_text + "<tr>";
      columnas.forEach(columna => {
        tab_text = tab_text + "<td>";
        tab_text = tab_text + data[i][columna];
        tab_text = tab_text + "</td>";
      });
      tab_text = tab_text + "</tr>";
    }
    tab_text = tab_text + "</table>";
    var table_html = tab_text;
    /******************************************************** */
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
  }

  /**
   * Evita que se ingrese letras en una caja de texto
   * @param event Objeto que dispara el evento
   */
  public SoloNumeros(event) {
    const key = window.event ? event.keyCode : event.which;
    // console.log(key);
    if (key === 0) { return true; }
    if (event.keyCode === 8 || event.keyCode === 46) {
      return true;
    } else if (key < 48 || key > 57) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Determina si una dirección de correo es válida o no
   * @param email Dirección de correo electrónico
   */
  public EmailValido(email) {
    const pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(email);
  }

  // $.fn.delayPasteKeyUp = function (fn, ms) {
  //   let timer = 0;
  //   $(this).on('propertychange input', function () {
  //     clearTimeout(timer);
  //     timer = setTimeout(fn, ms);
  //   });
  // };

  // $('#serialsticker').delayPasteKeyUp(function () {
  //   // $('#respuesta').append('Producto registrado: ' + $('#serialsticker').val() + '');
  //   $('#serialsticker').val('');
  //   }, 200);

  /**
   * Obtiene los valores de una tabla almacenados localmente
   * @param tabla Nombre de la tabla correspondiente a los valores a obtener
   */
  GetLocalStorage(tabla: string): any[] {
    tabla = environment.dbconsultas + '_' + tabla.toUpperCase();
    if (!localStorage.getItem(tabla)) {
      this.SetLocalEstorage(tabla);
      return [];
    }
    return JSON.parse(localStorage.getItem(tabla))['data'];
  }

  /**
   * Almacena localmente valores de una tabla para tenerlos disponibles en toda la vida de la sesión
   * @param tabla Nombre de la tabla a almacenar los datos localmente
   * @param valores Arreglo de datos correspondiente a la tabla consultada en la base de datos para guardarlos localmente
   * @param notificacion Muestra un mensaje de notificación cuando se actualizan los valores, por defecto esta en true
   */
  SetLocalEstorage(tabla: string, valores: any[] = [], notificacion = true) {
    const nombreTabla = tabla;
    tabla = environment.dbconsultas + '_' + tabla.toUpperCase();
    if (valores.length > 0 && notificacion) {
      this.Notificacion(
        'Datos de la tabla ' + nombreTabla.toUpperCase() + ' fueron actualizados localmente en ésta sesión'
        , 'info'
      );
    }
    localStorage.setItem(tabla, JSON.stringify({ data: valores }));
  }

  public GenerarID(longitud: number = 10) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < longitud; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
