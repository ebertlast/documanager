import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';
import swal from 'sweetalert2'; // https://limonte.github.io/sweetalert2/

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
   * @param positionClass Posición de la pantalla donde se desplegará la notificación: top-right, bottom-right  (Default), bottom-left,
   * top-full-width, bottom-full-width, top-center, bottom-center
   */
  public Notificacion(message: string, title = '', type = 'success', positionClass = 'top right'): void {
    toastr.options = {
      'closeButton': true,
      'debug': false,
      'progressBar': true,
      'preventDuplicates': true,
      'positionClass': 'toast-top-right',
      'onclick': null,
      'showDuration': '400',
      'hideDuration': '1000',
      'timeOut': '7000',
      'extendedTimeOut': '1000',
      'showEasing': 'swing',
      'hideEasing': 'linear',
      'showMethod': 'fadeIn',
      'hideMethod': 'fadeOut',
      icon: {
        error: 'fa fa-close',
        info: 'fa fa-info',
        success: 'something',
        warning: 'something'
      },
    };
    // console.log(message);
    switch (type) {
      case 'success':
        toastr.success(message, title);
        break;
      case 'error':
        toastr.error(message, title);
        break;
      case 'warning':
        toastr.warning(message, title);
        break;
      case 'info':
        toastr.info(message, title);
        break;
      default:
        this.Sonido();
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
    $('#theme').attr('href', 'assets/css/style.' + color + '-' + tonalidad.toString() + '.min.css');
  }

  /**
   * Tarda un determinado tiempo para ejecutar una acción, ejemplo:
   * this.sleep(1500).then(() => {
   *   console.log(' Do something after the sleep!');
   * });
   */
  public Sleep(time): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * Despliega un prompt para preguntar al usuario o para esperar una respuesta por parte de el. Ejemplo:
   * me._helper.Prompt(titulo,cuerpo).then((result) => { if (result.value) {} else if (result.dismiss === 'cancel') {} });
   * result.dismiss can be 'cancel', 'overlay', 'close', and 'timer'
   * @param _title Título del prompt
   * @param _text Cuerpo del Prompt
   * @param _type Por defecto (success) pueden ser: success, warning, error
   */
  public Prompt(_title: string, _text: string = '', _type = 'success'): Promise<any> {
    if (_type === 'warning') {
      return swal({
        title: _title,
        text: _text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, dese hacerlo',
        cancelButtonText: 'No, cancelar',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true
      });
    }
    if (_type === 'error') {
      return swal(
        _title,
        _text,
        'error'
      );
    }
    return swal(
      _title,
      _text,
      'success'
    );
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
   * @param audioName Nombre del audio a reproducir. Valor por defecto: branch_break,
   * opciones: [button_tiny, computer_error, glass, water_droplet, snap, branch_break]
   */
  public Sonido(audioName: string = 'branch_break') {
    ion.sound.play(audioName);
  }


  public ExportarExcel(data) {
    console.log(data);
    /******************************************************* */
    // #region Columnas
    const columnas: string[] = [];
    for (let _i = 0; _i < 1; _i++) {
      for (let key in data[_i]) {
        columnas.push(key);
      }
    }
    let j = 0;
    let tab_text = '<table border="2px">';
    tab_text = tab_text + '<tr bgcolor="#87AFC6">';
    columnas.forEach(titulo => {
      tab_text = tab_text + '<th>' + titulo + '</th>';
    });
    tab_text = tab_text + '</tr>';
    // #endregion
    for (let i = 0; i < data.length; i++) {
      tab_text = tab_text + '<tr>';
      columnas.forEach(columna => {
        tab_text = tab_text + '<td>';
        tab_text = tab_text + data[i][columna];
        tab_text = tab_text + '</td>';
      });
      tab_text = tab_text + '</tr>';
    }
    tab_text = tab_text + '</table>';
    const table_html = tab_text;
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

  public BytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) { return '0 Byte'; }
    const v = Math.floor(Math.log(bytes) / Math.log(1024));
    const i = parseInt(v.toString());
    let result = Math.pow(1024, i);
    result = bytes / result;
    result = Math.round(result);
    // return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    return result + ' ' + sizes[i];
  }

  public QuitarDuplicados(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};
    let i: any;
    for (i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
}
