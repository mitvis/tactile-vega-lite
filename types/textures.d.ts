declare module 'textures' {
  interface TextureBase {
    id(id?: string): any;
    url(): string;
    size(size: number): any;
    background(color: string): any;
    stroke(color: string): any;
    strokeWidth(width: number): any;
    thicker(factor?: number): any;
    thinner(factor?: number): any;
    heavier(factor?: number): any;
    lighter(factor?: number): any;
    (selection: any): void;
  }

  interface CirclesTexture extends TextureBase {
    radius(radius: number): CirclesTexture;
    complement(enable?: boolean): CirclesTexture;
    fill(color: string): CirclesTexture;
  }

  interface LinesTexture extends TextureBase {
    orientation(...orientations: string[]): LinesTexture;
    shapeRendering(rendering: string): LinesTexture;
  }

  interface PathsTexture extends TextureBase {
    d(pathDefinition: string | ((size: number) => string)): PathsTexture;
    fill(color: string): PathsTexture;
    shapeRendering(rendering: string): PathsTexture;
  }

  interface Textures {
    circles(): CirclesTexture;
    lines(): LinesTexture;
    paths(): PathsTexture;
  }

  const textures: Textures;
  export default textures;
}
