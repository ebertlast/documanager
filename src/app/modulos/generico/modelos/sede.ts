export class Sede {
  constructor(
    public tipo_id: string = '',
    public identificacion: string = '',
    public sede_id: string = '',
    public razon_social: string = '',
    public logo: string = '',
    public activa: number = 0,
    public fecha_registro: Date = null,
  ) { }
}
