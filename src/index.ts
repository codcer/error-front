const Cc = 1;
const ccFn = () => 1;

const arr = [1, 2, 3, 5, 6];

const a = arr.map(r => r * 2);
const b = Cc && arr && ccFn && Cc && arr && ccFn && Object.keys({ a: 1, b: 3 });
console.log("dddd");
