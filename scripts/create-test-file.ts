const { writeFileSync } = require("fs");

// Get first argument from command line
const fileName = process.argv[2];

// Verify current directory is scripts
if (__dirname.split('\\').pop() !== 'scripts') {
    const red = "\x1b[31m";
    const reset = "\x1b[0m";
    console.log(`${red}Please run this script using \`npm run createtest <filename>\`.${reset}`);
    // eslint-disable-next-line no-process-exit
    process.exit();
}

if (!fileName) {
    console.log(`Enter file name: `);

    process.stdin.on('data', (input) => {
        const fileName: string = input.toString().trim();

        // Create an empty .test.ts file
        writeFileSync(`${__dirname}/../test/${fileName}.test.ts`, '');

        // Exit process
        // eslint-disable-next-line no-process-exit
        process.exit(0);
    });
} else {

    // Create an empty .test.ts file
    writeFileSync(`${__dirname}/../test/${fileName}.test.ts`, '');
}