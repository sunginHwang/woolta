import { createProjectConfig } from '../../../vitest.shared.mjs';

export default createProjectConfig({ name: 'common-test', root: import.meta.dirname, environment: 'node' });
