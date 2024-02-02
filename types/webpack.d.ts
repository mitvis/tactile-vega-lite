// webpack.d.ts
declare interface NodeRequire {
    context: (
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ) => any;
  }
  