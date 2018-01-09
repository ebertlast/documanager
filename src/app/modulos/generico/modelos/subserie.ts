export class Subserie {
  constructor(
    public consecutivo: number = 0,
    public subserie_id: string = '',
    public denominacion: string = '',
    public serie_id: string = '',
    public serie: string = '',
    public tipo_id: string = '',
    public identificacion: string = '',
    public sede_id: string = '',
    public fecha_registro: Date = null,
    public sede: string = '',
    public tercero: string = '',
  ) { }
}
