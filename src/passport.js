import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import passort from "passport";
import JwtStrategy from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
  jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secret: process.env.JWT_SECRET
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user != null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch {
    done(error, false);
  }
};

passort.use(new JwtStrategy(jwtOptions, verifyUser));
