import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchivoService } from '../../servicios/archivo.service';
import { Archivo } from '../../modelos/archivo';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../seguridad/servicios/auth.service';
import { PagerService } from '../../../generico/servicios/pager.service';
declare var PDFJS: any;
declare var animationHover: any;
// declare var elevateZoom: any;
@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.css']
})
export class ArchivoComponent implements OnInit, OnDestroy {
  private sub: any;
  public pager: any = {};
  public allItems: string[] = [];
  public pagedItems: string[] = [];
  public itemsPorPagina = 10;
  // #region Intento de hacer algo con PDF.js
  public url = '';
  public pdfDoc = null;
  public pageNum = 1;
  public pageRendering = false;
  public pageNumPending = null;
  public scale = 1.5;
  public zoomRange = 0.25;
  public canvas: any = null;
  public ctx = null;
  // #endregion

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _archivoService: ArchivoService,
    private _authService: AuthService,
    private _pagerService: PagerService,
  ) { }


  private _archivo: Archivo = new Archivo();
  public get archivo(): Archivo {
    return this._archivo;
  }
  public set archivo(v: Archivo) {
    this._archivo = v;
  }


  private _imagenes: string[] = [];
  public get imagenes(): string[] {
    return this._imagenes;
  }
  public set imagenes(v: string[]) {
    this._imagenes = v;
  }



  ngOnInit() {
    const me = this;
    me.sub = me._activatedRoute.params.subscribe(params => {
      const archido_id = params['archivo_id'];
      me._archivoService.registros(archido_id).subscribe(archivos => {
        archivos.forEach(archivo => {
          me.archivo = archivo;
          console.log(me.archivo);
          me.imagenes = [];
          const paginas = (me.archivo.paginas > 10) ? 10 : me.archivo.paginas;
          for (let i = 1; i <= paginas; i++) {
            me.imagenes.push(me.archivo.directorio + '/' + i + '.jpg');
          }


          for (let i = 1; i <= me.archivo.paginas; i++) {
            this.allItems.push(me.archivo.directorio + '/' + i + '.jpg');
          }

          this.set_page(1);


          // #region desplegar el PDF

          const pasar = false;
          if (pasar) {
            me.url = me.archivo.directorio + '/' + me.archivo.nombre;
            // me.url = 'c:/Users/Lenovo/Downloads/Prueba/Psico-Cibernética (Maxwell Maltz).pdf';
            console.log(me.url);
            me.canvas = $('#the-canvas')[0]; // <HTMLElement>document.getElementById('the-canvas');
            me.ctx = me.canvas.getContext('2d');
            document.getElementById('prev').addEventListener('click', me.onPrevPage);
            document.getElementById('next').addEventListener('click', me.onNextPage);
            document.getElementById('zoomin').addEventListener('click', me.onZoomIn);
            document.getElementById('zoomout').addEventListener('click', me.onZoomOut);
            document.getElementById('zoomfit').addEventListener('click', me.onZoomFit);
            /**
             * Asynchronously downloads PDF.
             */
            // PDFJS.getDocument({
            //   'url': me.url,
            //   httpHeaders: { Authorization: `Bearer ${me._authService.Usuario().token}` },
            //   withCredentials: true,
            // })
            PDFJS.getDocument(me.url)
              .then(function (pdfDoc_) {
                me.pdfDoc = pdfDoc_;
                const documentPagesNumber = me.pdfDoc.numPages;
                document.getElementById('page_count').textContent = '/ ' + documentPagesNumber;

                $('#page_num').on('change', function () {
                  const pageNumber = Number($(this).val());
                  if (pageNumber > 0 && pageNumber <= documentPagesNumber) {
                    me.queueRenderPage(pageNumber, me.scale);
                  }

                });

                // Initial/first page rendering
                me.renderPage(me.pageNum, me.scale);
              });

            // this.renderPage(1, 100);
          }

          // #endregion
        });
      });
    });

    $('.file-box').each(function () {
      animationHover(this, 'pulse');
    });

    const img: any = $('img');
    // img.each(function () {
    //   animationHover(this, 'pulse');
    // });
    // img.elevateZoom({
    //   zoomType: 'lens',
    //   lensShape: 'round',
    //   lensSize: 200
    // });

  }

  // #region métodos para manejar el PDF
  /**
  * Get page info from document, resize canvas accordingly, and render page.
  * @param num Page number.
  */
  public renderPage(num, scale = this.scale) {
    const me = this;
    me.pageRendering = true;
    // Using promise to fetch the page
    me.pdfDoc.getPage(num).then(function (page) {
      const viewport = page.getViewport(scale);
      me.canvas.height = viewport.height;
      me.canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: me.ctx,
        viewport: viewport
      };
      const renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        me.pageRendering = false;
        if (me.pageNumPending !== null) {
          // New page rendering is pending
          me.renderPage(me.pageNumPending);
          me.pageNumPending = null;
        }
      });
    });

    // Update page counters
    // document.getElementById('page_num').value = num;
    $('#page_num').val(num);
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  public queueRenderPage(num, scale = this.scale) {
    const me = this;
    if (me.pageRendering) {
      me.pageNumPending = num;
    } else {
      me.renderPage(num, scale);
    }
  }

  /**
   * Displays previous page.
   */
  public onPrevPage() {
    const me = this;
    if (me.pageNum <= 1) {
      return;
    }
    me.pageNum--;
    const scale = me.pdfDoc.scale;
    me.queueRenderPage(me.pageNum, me.scale);
  }

  /**
   * Displays next page.
   */
  public onNextPage() {
    const me = this;
    if (me.pageNum >= me.pdfDoc.numPages) {
      return;
    }
    me.pageNum++;
    const scale = me.pdfDoc.scale;
    me.queueRenderPage(me.pageNum, me.scale);
  }

  /**
   * Zoom in page.
   */
  public onZoomIn() {
    const me = this;
    if (me.scale >= me.pdfDoc.scale) {
      return;
    }
    me.scale += me.zoomRange;
    const num = me.pageNum;
    me.renderPage(num, me.scale);
  }

  /**
   * Zoom out page.
   */
  public onZoomOut() {
    const me = this;
    if (me.scale >= me.pdfDoc.scale) {
      return;
    }
    me.scale -= me.zoomRange;
    const num = me.pageNum;
    me.queueRenderPage(num, me.scale);
  }
  /**
   * Zoom fit page.
   */
  public onZoomFit() {
    const me = this;
    if (me.scale >= me.pdfDoc.scale) {
      return;
    }
    me.scale = 1;
    const num = me.pageNum;
    me.queueRenderPage(num, me.scale);
  }

  // #endregion


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public abrirArchivo(source: string) {
    const win = window.open();
    win.document.write('<iframe width="100%" height="100%" src="' + source + '" frameborder="0" allowfullscreen></iframe>');
    return false;
  }

  public set_page(page: number) {
    console.log('Page:' + page + ', this.allItems.length:' + this.allItems.length);
    if (page < 1) {
      // if (page < 1 || page > this.pager.totalPages) {
      // console.log('Página: '+page.toString()+', Total Páginas: '+this.pager.totalPages);
      return;
    }
    if (page > this.pager.totalPages) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems.length, page, this.itemsPorPagina);
    // console.log(this.pager.startIndex);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    console.log(this.pagedItems);
  }

  public getImagen(page: number) {
    const imagen = this.pagedItems[page];
    console.log(imagen);
    return imagen;

  }

}
