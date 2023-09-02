import { TypingAnimation } from "./TypingAnimation";

const headlineContainer = document.getElementById("app");

const headline = new TypingAnimation(headlineContainer);

headline.addText("Nate", { bold: true, italic: true, underline: true });
headline.addText("+", { fontSize: "24px", color: "red", fontFamily: "Arial" });
headline.addText("Bridge", { fontSize: "24px", fontFamily: "Arial" });
headline.addText("=", { fontSize: "24px", color: "red" });
headline.addText("<3", {
  color: "pink",
  fontSize: "48px",
  fontFamily: "Arial",
});
headline.position("right");

headline.play({ backspace: false, continuous: false, newLine: true });
