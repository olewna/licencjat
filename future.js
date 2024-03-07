const sentence = "Hello world";
let wynik = "";

sentence.split("").forEach((x) => {
  let charCode = 65;
  while (String.fromCharCode(charCode) !== x) {
    if (x === " ") {
      console.log(wynik + " ");
      wynik += " ";
      break;
    } else if (charCode === 90) {
      console.log(wynik + String.fromCharCode(charCode));
      charCode = 97;
    } else {
      console.log(wynik + String.fromCharCode(charCode));
      charCode++;
    }
  }
  if (x !== " ") {
    console.log(wynik + String.fromCharCode(charCode));
    wynik += String.fromCharCode(charCode);
  }
});
