import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma";
import { env } from "../config/env";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export async function registerUser({ email, password, name }: RegisterInput) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const token = signToken(user.id, user.email);
  return { user, token };
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  const token = signToken(user.id, user.email);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
}