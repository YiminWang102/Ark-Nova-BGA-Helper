const esbuild = require('esbuild');

// Function to build and watch
async function buildAndWatch(entry, output) {
  try {
    const ctx = await esbuild.context({
      entryPoints: [entry],
      bundle: true,
      outfile: output,
      format: 'iife',
      target: ['chrome91'],
      minify: true,
      sourcemap: true,
    });

    // Enable watch mode
    await ctx.watch();
    console.log(`Watching for changes in ${entry}...`);
  } catch (err) {
    console.error(`Build failed for ${entry}:`, err);
    process.exit(1);
  }
}

// Main function to initialize builds
(async () => {
  await buildAndWatch('./scripts/content.js', './dist/bundledContent.js');
})();
