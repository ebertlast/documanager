export class Grupo {
  constructor(
    public grupo_id: string = '',
    public denominacion: string = '',
    public tipo_id: string = '',
    public identificacion: string = '',
    public sede_id: string = '',
    public activo: number = 0,
    public fecha_registro: Date = null,
    public sede: string = '',
  ) { }
}
