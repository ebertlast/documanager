export class TablaGenerica {
  constructor(
    public tabla: string = '',
    public campo: string = '',
    public codigo: string = '',
    public dato: string = '',
    public cantidad: number = 0,
    public valor: number = 0,
    public fecha: Date = null,
    public observacion: string = '',
  ) { }
}
