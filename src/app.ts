import { PucrsClient } from "./client";
import "./plugins/hours-grid.plugin";
import "./plugins/grade-grid.plugin";
import "./plugins/bill.plugin";
import account from "../secrets/account.json";
import { inspect } from "util";

async function main() {
  let client = new PucrsClient();
  if (account.useToken) {
    let loginResult = await client.loginWithToken(account.token);
    console.log('Login Success:', loginResult.success, ', Error:', loginResult.error);
    if (!loginResult.success) return;
  } else {
    let loginResult = await client.login(account.registry, account.password);
    console.log('Login Success:', loginResult.success, ', Error:', loginResult.error);
    if (!loginResult.success) return;
  }
  
  //let hoursGrade = await client.hoursGrid();
  //console.log(inspect(hoursGrade, false, null, true));
  
  let gradeGrid = await client.gradeGrid(); // Slow request
  console.log(inspect(gradeGrid, false, null, true));
  
  //let bill = await client.bill();
  //console.log(bill);

}

main();
