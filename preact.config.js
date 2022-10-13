export default (config) => {
  if (config.mode === 'production') {
    config.output.publicPath = '/sunny/';
  }
};
