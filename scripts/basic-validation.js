const fs = require('fs');
const path = require('path');

const checks = [
    {
        label: 'package.json',
        run: () => {
            const contents = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
            JSON.parse(contents);
        }
    },
    {
        label: 'src/App.tsx',
        run: () => {
            const target = path.join(process.cwd(), 'src', 'App.tsx');
            if (!fs.existsSync(target)) {
                throw new Error('src/App.tsx not found');
            }
        }
    },
    {
        label: 'desktop/main/main.ts',
        run: () => {
            const target = path.join(process.cwd(), 'desktop', 'main', 'main.ts');
            if (!fs.existsSync(target)) {
                throw new Error('desktop/main/main.ts not found');
            }
        }
    }
];

console.log('✅ Running basic project validation...');

checks.forEach(({ label, run }) => {
    try {
        run();
        console.log(`✅ ${label} - OK`);
    } catch (error) {
        console.error(`❌ ${label} - ERROR: ${error.message}`);
        process.exitCode = 1;
    }
});

if (process.exitCode) {
    process.exit(1);
}

console.log('✅ Basic validation passed!');
