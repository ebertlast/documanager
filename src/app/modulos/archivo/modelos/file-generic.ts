export class FileGeneric {
  constructor(
    public name: string = '',
    public lastModified: number = 0,
    public lastModifiedDate: Date = null,
    public size: number = 0,
    public type: string = '',
    public webkitRelativePath: string = '',
  ) { }
}
