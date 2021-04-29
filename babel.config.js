module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
  compact: 'auto',
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods'],
};
