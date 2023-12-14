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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const axios_1 = require("@nestjs/axios");
const mail_service_1 = require("../mail/mail.service");
const node_fetch_1 = require("node-fetch");
const prisma_service_1 = require("../prisma/prisma.service");
var crypto = require("crypto");
const FormData = require("form-data");
let AuthController = class AuthController {
    constructor(authService, http, prismaService, mailService) {
        this.authService = authService;
        this.http = http;
        this.prismaService = prismaService;
        this.mailService = mailService;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signin(dto) {
        return this.authService.signin(dto);
    }
    check_token(body) {
        return this.authService.check_token(body['token'], body['id']);
    }
    async get42redirect(request, res) {
        const formData = new FormData();
        formData.append('grant_type', 'authorization_code');
        formData.append('client_id', process.env.FOURTYTWO_CLIENT_ID);
        formData.append('client_secret', process.env.FOURTYTWO_CLIENT_SECRET);
        formData.append('redirect_uri', process.env.FOURTYTWO_CALLBACK_URL);
        formData.append('code', request.body.code);
        const response = await (0, node_fetch_1.default)('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            body: formData
        });
        const tokens = await response.json();
        const headers = { Authorization: 'Bearer ' + tokens['access_token'] };
        const resp2 = await (0, node_fetch_1.default)('https://api.intra.42.fr/v2/me', { headers });
        if (!resp2.ok)
            throw new Error('user not found');
        const data = await resp2.json();
        const token = this.authService.create42user(data['login'], data['email']);
        res.status(common_1.HttpStatus.OK).send((await token));
        return;
    }
    SendMail(uid) {
        return this.authService.SendMail(uid);
    }
    check2fa(uid) {
        return this.authService.check2fa(uid);
    }
    geturl() {
        return this.authService.geturl();
    }
    async getRooms() {
        return await this.prismaService.room.findMany({
            include: {
                message: true,
            },
        });
    }
    async getUsers() {
        return await this.prismaService.user.findMany();
    }
    async getConnectedUsers() {
        return await this.prismaService.connectedUser.findMany({});
    }
    async getJoinedRoom() {
        return await this.prismaService.joinedRoom.findMany();
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.signupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.signinDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('check'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "check_token", null);
__decorate([
    (0, common_1.Post)('42redirect'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get42redirect", null);
__decorate([
    (0, common_1.Get)(':uid/SendMail'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "SendMail", null);
__decorate([
    (0, common_1.Get)(':uid/check2fa'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "check2fa", null);
__decorate([
    (0, common_1.Get)('/geturl'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "geturl", null);
__decorate([
    (0, common_1.Get)('rooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('coUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getConnectedUsers", null);
__decorate([
    (0, common_1.Get)('joinedRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getJoinedRoom", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, axios_1.HttpService, prisma_service_1.PrismaService, mail_service_1.MailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map