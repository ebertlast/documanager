export class Usuario {
  constructor(
    public usuario_id: string = '',
    public clave: string = '',
    public email: string = '',
    public nombres: string = '',
    public activo: number = 0,
    public avatar: string = '',
    public fecha_registro: Date = null,
    public grupo_id: string = '',
    public grupo: string = '',
    public tipo_id: string = '',
    public identificacion: string = '',
    public sede: string = '',
    public tercero: string = '',
    public token: string = '',
  ) { }
}
