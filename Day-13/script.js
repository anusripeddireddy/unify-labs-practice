function runJS() {

  let text = "";

  // var, let, const
  var a = 10;
  let b = 20;
  const c = 30;

  text += "var a = " + a + "<br>";
  text += "let b = " + b + "<br>";
  text += "const c = " + c + "<br><br>";

  // Data Types
  let num = 100;
  let str = "Hello";
  let bool = true;
  let x;
  let y = null;

  text += "Data Types:<br>";
  text += "num: " + typeof num + "<br>";
  text += "str: " + typeof str + "<br>";
  text += "bool: " + typeof bool + "<br>";
  text += "x: " + typeof x + "<br>";
  text += "y: " + typeof y + "<br><br>";

  // Arithmetic Operators
  let p = 10, q = 3;
  text += "Arithmetic:<br>";
  text += "p + q = " + (p + q) + "<br>";
  text += "p - q = " + (p - q) + "<br>";
  text += "p * q = " + (p * q) + "<br>";
  text += "p / q = " + (p / q) + "<br>";
  text += "p % q = " + (p % q) + "<br><br>";

  // Plus Operator Deep Dive
  text += "Plus Operator:<br>";
  text += "10 + 20 = " + (10 + 20) + "<br>";
  text += "'10' + 20 = " + ("10" + 20) + "<br>";
  text += "10 + '20' = " + (10 + "20") + "<br><br>";

  // Comparison Operators
  let m = 10, n = "10";
  text += "Comparison:<br>";
  text += "m == n : " + (m == n) + "<br>";
  text += "m === n : " + (m === n) + "<br>";
  text += "m != n : " + (m != n) + "<br>";
  text += "m !== n : " + (m !== n) + "<br>";

  document.getElementById("output").innerHTML = text;
}
