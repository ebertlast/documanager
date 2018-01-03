export class Lote {
  constructor(
    public lote_id: string = '',
    public archivo_id: string = '',
    public usuario_id: string = '',
    public procesado: number = 0,
    public fecha_registro: Date = null,
  ) { }
}
