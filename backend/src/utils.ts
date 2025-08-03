export function random(len : number ){
let options = "abcdefghijklmnopqrstuvwxyz0123456789";
let ans =""
const length = options.length;
for (let i = 0; i < len; i++) {
ans+= options[Math.floor((Math.random()  * length))] }
return ans;
}