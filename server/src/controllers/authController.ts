import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginSchema, RegisterSchema } from '@oruvia/shared';
import { User } from '../models/User';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/errorHandler';

function generateTokens(user: any) {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as any,
  });

  return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = LoginSchema.parse(req.body);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await logAudit(
    { user: { id: user._id.toString(), email: user.email, role: user.role, name: user.name } } as any,
    'USER_LOGIN',
    'User',
    user._id.toString()
  );

  res.json({
    token: accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      affiliation: user.affiliation,
      bio: user.bio,
    },
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.parse(req.body);

  const existing = await User.findOne({ email: parsed.email.toLowerCase() });
  if (existing) {
    res.status(409).json({ error: 'User with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);
  const user = await User.create({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    passwordHash,
    role: parsed.role,
    affiliation: parsed.affiliation,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.status(201).json({
    token: accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      affiliation: user.affiliation,
    },
  });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Signed out successfully.' });
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const incoming = req.body.refreshToken || req.cookies?.refreshToken;
  if (!incoming) {
    res.status(401).json({ error: 'Refresh token missing.' });
    return;
  }

  try {
    const decoded = jwt.verify(incoming, config.jwt.refreshSecret) as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User no longer exists.' });
      return;
    }

    const tokens = generateTokens(user);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
}
