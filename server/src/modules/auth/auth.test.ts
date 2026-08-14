import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../middleware/auth';

describe('Auth Utility & Token Logic Tests', () => {
  const secret = 'test-jwt-secret-key-12345';

  it('should correctly hash and verify user passwords with bcrypt', async () => {
    const password = 'mySuperSecretPassword123!';
    const hash = await bcrypt.hash(password, 10);

    expect(hash).not.toBe(password);
    const match = await bcrypt.compare(password, hash);
    expect(match).toBe(true);

    const wrongMatch = await bcrypt.compare('wrongPassword', hash);
    expect(wrongMatch).toBe(false);
  });

  it('should correctly sign and verify JWT tokens containing schoolId and role', () => {
    const payload: JwtPayload = {
      userId: 'user-cuid-123',
      role: 'SCHOOL_ADMIN',
      schoolId: 'school-cuid-456',
    };

    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, secret) as JwtPayload;
    expect(decoded.userId).toBe('user-cuid-123');
    expect(decoded.role).toBe('SCHOOL_ADMIN');
    expect(decoded.schoolId).toBe('school-cuid-456');
  });
});
