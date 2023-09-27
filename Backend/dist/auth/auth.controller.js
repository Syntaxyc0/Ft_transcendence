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
let AuthController = exports.AuthController = class AuthController {
    constructor(authService, http) {
        this.authService = authService;
        this.http = http;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signin(dto) {
        return this.authService.signin(dto);
    }
    get42auth(res) {
        const clientID = process.env.FOURTYTWO_CLIENT_ID;
        const clientSecret = process.env.FOURTYTWO_CLIENT_SECRET;
        const callbackURL = process.env.FOURTYTWO_CALLBACK_URL;
    }
    async get42redirect(res, request) {
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.FOURTYTWO_CLIENT_ID,
            client_secret: process.env.FOURTYTWO_CLIENT_SECRET,
            code: res.req.query.code,
            redirect_uri: "http://localhost:3333/auth/42redirect"
        };
        this.http.post("https://api.intra.42.fr/oauth/token", payload).subscribe(ret => {
            this.token = ret.data.access_token;
        }, err => console.log(err));
        res.cookie('access_token', this.token);
        res.redirect("http://localhost:4200/home");
        return;
    }
};
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
    (0, common_1.Get)('42auth'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "get42auth", null);
__decorate([
    (0, common_1.Get)('42redirect'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get42redirect", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, axios_1.HttpService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map