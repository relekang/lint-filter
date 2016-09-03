// flow-typed signature: 51c059a71db380afd0647161e78ecf92
// flow-typed version: 230c72bbaf/get-stdin_v5.x.x/flow_>=v0.28.x

declare module 'get-stdin' {
  declare module.exports: {
    (): Promise<string>,
    buffer(): Promise<Buffer>,
  };
}
