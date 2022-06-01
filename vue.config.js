module.exports = {
  devServer: {
    public: '0.0.0.0:8080'
  },
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Planning Poker'
        return args
      })
  },
  pwa: {
    name: 'Planning Poker'
  }
}
