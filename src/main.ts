import { TypingAnimation } from "./TypingAnimation";

const headlineContainer = document.getElementById("app");

const headline = new TypingAnimation(headlineContainer);

headline.addText("Nate", { bold: true, italic: true, underline: true });
headline.addText("+", { fontSize: "24px", color: "red", fontFamily: "Arial" });
headline.justify("left");

headline.play({ backspace: true, continuous: true });
