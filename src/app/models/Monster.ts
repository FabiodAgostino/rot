export class Monster {
  kind?: string;
  mimeType: string;
  id: string;
  name: string;
  url: string; // Aggiungi una proprietà url

  constructor(id: string, mimeType: string, name: string) {
    this.id = id;
    this.mimeType = mimeType.includes('folder') ? 'folder' : 'image';;
    this.name=name.replace(/\.(png|PNG|JPG|jpg)/g, '').replace(/_/g, "'");;
    this.url = `https://drive.google.com/uc?id=${id}`;
  }
  }


  export class MonsterNode {
    constructor(
      public id: string,
      public mimeType: string,
      public name: string,
      public folders: MonsterNode[] = [],
      public url: string,
    ) {}
  }

  export interface FlatNode {
    expandable: boolean;
    name: string;
    level: number,
    url: string
  }
  