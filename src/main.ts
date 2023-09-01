import { TypingAnimation } from "./TypingAnimation";

const headlineContainer = document.getElementById("app");

const headline = new TypingAnimation(headlineContainer);

headline.addText({ string: "Nathan", styles: { bold: true, italic: true } });
headline.addText({
  string: "Bridget",
  styles: { fontSize: "24px", color: "red", fontFamily: "Arial" },
});
headline.play();
