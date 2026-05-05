import { describe, expect, it } from 'vitest';
import { ErrorClassification, GSDError } from './errors.js';
import { toToolsErrorFromUnknown } from './query-tools-error-factory.js';

describe('query tools error mapper', () => {
  it('maps GSDError to GSDToolsError exit code', () => {
    const err = toToolsErrorFromUnknown('state', ['load'], new GSDError('bad input', ErrorClassification.Validation));
    expect(err.exitCode).toBe(10);
    expect(err.message).toBe('bad input');
  });

  it('attaches timeout classification when message indicates timeout', () => {
    const err = toToolsErrorFromUnknown('state', ['load'], new Error('gsd-tools timed out after 1234ms: state load'));
    expect(err.classification).toEqual({ kind: 'timeout', timeoutMs: 1234 });
  });

  it('attaches failure classification for non-timeout failures', () => {
    const err = toToolsErrorFromUnknown('state', ['load'], new Error('boom'));
    expect(err.classification).toEqual({ kind: 'failure' });
  });
});
