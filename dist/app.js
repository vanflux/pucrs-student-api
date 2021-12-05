"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
require("./plugins/hours-grid.plugin");
require("./plugins/grade-grid.plugin");
require("./plugins/bill.plugin");
const account_json_1 = __importDefault(require("../secrets/account.json"));
const util_1 = require("util");
async function main() {
    let client = new client_1.PucrsClient();
    if (account_json_1.default.useToken) {
        let loginResult = await client.loginWithToken(account_json_1.default.token);
        console.log('Login Success:', loginResult.success, ', Error:', loginResult.error);
        if (!loginResult.success)
            return;
    }
    else {
        let loginResult = await client.login(account_json_1.default.registry, account_json_1.default.password);
        console.log('Login Success:', loginResult.success, ', Error:', loginResult.error);
        if (!loginResult.success)
            return;
    }
    //let hoursGrade = await client.hoursGrid();
    //console.log(inspect(hoursGrade, false, null, true));
    let gradeGrid = await client.gradeGrid(); // Slow request
    console.log((0, util_1.inspect)(gradeGrid, false, null, true));
    //let bill = await client.bill();
    //console.log(bill);
}
main();
