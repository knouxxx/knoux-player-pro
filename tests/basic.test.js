test('package.json should exist and be valid', () => {
    const packageJson = require('../package.json');
    expect(packageJson.name).toBe('knoux-player-x');
    expect(packageJson.version).toBeDefined();
});
