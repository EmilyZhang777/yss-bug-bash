module.exports = {
  plugins: [
    ['postcss-line-height-px-to-unitless'],
    ['postcss-pxtorem', 
      {
        'rootValue': 16,
        'propList': ['*', '!box-shadow'],
        'mediaQuery': true,
      }
    ],
    [
      'autoprefixer',
      {
        'grid': true,
      }
    ],
    [
      require('@yext/pages-buildtools/webpack/plugins/postcss-yext-prefixer/yext-prefixer.js')({
        'prefix': '',
      }),
    ]
  ],
}
