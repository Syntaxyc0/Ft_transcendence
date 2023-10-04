"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let AuthService = exports.AuthService = class AuthService {
    constructor(prisma, jwt, config, httpService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.httpService = httpService;
    }
    async signin(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: dto.login,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException("credentials incorrect");
        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches)
            throw new common_1.ForbiddenException("credentials incorrect");
        return this.signToken(user.id, user.login);
    }
    async signup(dto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    login: dto.login,
                    hash,
                },
                select: {
                    id: true,
                    login: true,
                }
            });
            return this.signToken(user.id, user.login);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002")
                    throw new common_1.ForbiddenException("Credentials taken");
            }
            throw error;
        }
    }
    async signToken(userId, login) {
        const payload = {
            sub: userId,
            login,
        };
        const secret = this.config.get("JWT_SECRET");
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret
        });
        return { access_token: token, id: userId };
    }
    async create42user(login, email) {
        try {
            const pass = this.generateRandomPassword();
            const hash = await argon.hash(pass);
            const alreadyregistered = await this.prisma.user.findUnique({
                where: {
                    login: login,
                },
            });
            if (alreadyregistered)
                return this.signToken(alreadyregistered.id, alreadyregistered.login);
            const user = await this.prisma.user.create({
                data: {
                    email: email,
                    login: login,
                    avatar: "",
                    hash,
                },
                select: {
                    id: true,
                    login: true,
                }
            });
            return this.signToken(user.id, user.login);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002")
                    throw new common_1.ForbiddenException("Credentials taken");
            }
            throw error;
        }
    }
    generateRandomPassword() {
        const password = Math.random().toString(36);
        return password;
    }
    check_token(req, res) {
        const token = req['access_token'];
        if (!token)
            return false;
        try {
            const payload = this.jwt.verify(token);
            if (!payload)
                return false;
            if (!payload.isLogged)
                return false;
        }
        catch (e) {
            console.log("token expired");
        }
        return true;
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService, axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map