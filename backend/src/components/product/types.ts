export namespace Product {
  export interface Image {
    fileName: string;
    originalName: string;
  }

  export interface Item {
    title: string;
    image: Image;
    category: string;
    description?: string;
    price?: number | null;
  }
}
