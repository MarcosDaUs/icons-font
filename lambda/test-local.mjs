import { generateFonts } from 'fantasticon';

const results = await generateFonts({
  inputDir: './tmp/icons', // (required)
  outputDir: './tmp/dist', // (required)
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['css', 'html'],
  formatOptions: {},
  // Customize generated icon IDs (unavailable with `.json` config file)
  getIconId: ({
    basename, // `string` - Example: 'foo';
  }) => ['if', basename].join('-') // 'if-foo'
});
console.log('results: ');
console.log(results);

