export class Tipo {
  constructor(
    public tipo_id: string = '',
    public denominacion: string = '',
    public consecutivo: number = 0,
    public retencion_central: number = 0,
    public retencion_gestion: number = 0,
    public soporte_electronico: number = 0,
    public soporte_fisico: number = 0,
    public procedimiento: string = '',
    public activo: number = 1,
  ) { }
}
