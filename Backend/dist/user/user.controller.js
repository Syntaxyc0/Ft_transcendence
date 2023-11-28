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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const user_service_1 = require("./user.service");
const platform_express_1 = require("@nestjs/platform-express");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUserFromId(uid) {
        const user = this.userService.getUserFromId(uid);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    getUserFromLogin(login) {
        const user = this.userService.getUserFromLogin(login);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    updateUserStatus(uid, status) {
        return this.userService.updateUserStatus(uid, status);
    }
    GetUserStatus(uid) {
        return this.userService.GetUserStatus(uid);
    }
    GetUserFriendlist(uid) {
        return this.userService.GetUserFriendlist(uid);
    }
    getUserLogin(uid) {
        return this.userService.getlogin(uid);
    }
    getUserElo(uid) {
        return this.userService.getelo(uid);
    }
    updateUserElo(uid, elo) {
        return this.userService.updateUserElo(uid, elo);
    }
    AddFriend(uid, userName) {
        return this.userService.AddFriend(uid, userName['userName']);
    }
    RemoveFriend(uid, userId) {
        return this.userService.RemoveFriend(uid, userId['userId']);
    }
    uploadFile(uid, file) {
        return this.userService.uploadFile(uid, file);
    }
    async getAvatar(uid, res) {
        try {
            const user = await this.userService.getUserFromId(uid);
            if (user.avatar) {
                const fileName = user.avatar;
                const result = res.sendFile(fileName, { root: "./assets" });
                return result;
            }
            else if (user.avatar === "") {
                const result = res.sendFile("stitch.png", { root: "./public" });
                return result;
            }
        }
        catch {
            throw new common_1.NotFoundException('Image not Found');
        }
    }
    switch2fa(uid, activate) {
        return this.userService.switch2fa(uid, activate);
    }
    get2faenabled(uid) {
        return this.userService.get2faenabled(uid);
    }
    async findAllByLogin(login) {
        return this.userService.findAllByLogin(login);
    }
    async getAllUsers() {
        return this.userService.allUser();
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(':uid'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserFromId", null);
__decorate([
    (0, common_1.Get)(':login'),
    __param(0, (0, common_1.Param)('login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserFromLogin", null);
__decorate([
    (0, common_1.Patch)(':uid/status'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Get)(':uid/status'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "GetUserStatus", null);
__decorate([
    (0, common_1.Get)(':uid/friendlist'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "GetUserFriendlist", null);
__decorate([
    (0, common_1.Get)(":uid/login"),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserLogin", null);
__decorate([
    (0, common_1.Get)(":uid/elo"),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserElo", null);
__decorate([
    (0, common_1.Patch)(':uid/elo'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUserElo", null);
__decorate([
    (0, common_1.Patch)(':uid/AddFriend'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "AddFriend", null);
__decorate([
    (0, common_1.Patch)(':uid/RemoveFriend'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "RemoveFriend", null);
__decorate([
    (0, common_1.Post)(':uid/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './assets',
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('/:uid/avatar'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Post)('/:uid/switch2fa'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "switch2fa", null);
__decorate([
    (0, common_1.Get)('/:uid/2faenabled'),
    __param(0, (0, common_1.Param)('uid', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "get2faenabled", null);
__decorate([
    (0, common_1.Get)('/find-by-login/:login'),
    __param(0, (0, common_1.Param)('login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllByLogin", null);
__decorate([
    (0, common_1.Get)('/all-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map