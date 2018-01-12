export class Archivo {
  constructor(
    public archivo_id: string = '',
    public nombre: string = '',
    public peso: string = '',
    public paginas: number = 0,
    public usuario_id: string = '',
    public fecha_registro: Date = null,
    public tipo: string = '',
    public directorio: string = '',
    public grupo: string = '',
    public tipo_id: string = '',
    public identificacion: string = '',
    public sede: string = '',
    public tercero: string = '',
    public lote: string = '',
    public procesado: number = 0,
    public fecha_archivo: Date = null,
    public consecutivo_tipo: number = -1,
  ) { }
}
