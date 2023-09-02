import { TypingAnimation } from "./TypingAnimation";

const headlineContainer = document.getElementById("app");

const headline = new TypingAnimation(headlineContainer);

headline.addText({
  string: "Nate",
  styles: { bold: true, italic: true, underline: true },
});
headline.addText({
  string: "+",
  styles: { fontSize: "24px", color: "red", fontFamily: "Arial" },
});
headline.addText({
  string: "Bridge",
  styles: { fontSize: "24px", fontFamily: "Arial" },
});
headline.addText({
  string: "=",
  styles: { fontSize: "24px", color: "red" },
});
headline.addText({
  string: "<3",
  styles: { color: "pink", fontSize: "48px", fontFamily: "Arial" },
});

headline.position("center", "center");

headline.play({ backspace: false, continuous: false, newLine: true });
