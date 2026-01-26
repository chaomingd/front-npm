import { describe, it, expect } from 'vitest';
import { uuid, shortUUID } from '..';

// Helper function to check UUID format
function isValidUUID(v: string): boolean {
  const uuidRegex = /^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}$/i;
  return uuidRegex.test(v);
}

// Helper function to check short UUID format
function isValidShortUUID(v: string): boolean {
  const shortUuidRegex = /^[0-9a-f]{8}$/i;
  return shortUuidRegex.test(v);
}

describe('UUID Functions', () => {
  it('should generate a valid UUID', () => {
    const generatedUUID = uuid();
    expect(isValidUUID(generatedUUID)).toBe(true);
  });

  it('should generate a valid short UUID', () => {
    const generatedShortUUID = shortUUID();
    expect(isValidShortUUID(generatedShortUUID)).toBe(true);
  });

  it('should generate different UUIDs on each call', () => {
    const uuid1 = uuid();
    const uuid2 = uuid();
    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate different short UUIDs on each call', () => {
    const shortUUID1 = shortUUID();
    const shortUUID2 = shortUUID();
    expect(shortUUID1).not.toBe(shortUUID2);
  });
});
