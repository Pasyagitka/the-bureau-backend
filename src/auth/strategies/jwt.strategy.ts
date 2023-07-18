import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type Token = {
  sub: any;
  role: any;
  userId: number;
  login: string;
  client: {
    id: number;
  };
  brigadier: {
    id: number;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Token) {
    return {
      id: payload.sub,
      login: payload.login,
      role: payload.role,
      client: {
        id: payload.client?.id,
      },
      brigadier: {
        id: payload.brigadier?.id,
      },
    };
  }
}
