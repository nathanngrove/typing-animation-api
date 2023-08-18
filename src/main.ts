import { TypingAnimation } from "./TypingAnimation";

const headlineContainer = document.getElementById("app");

const headline = new TypingAnimation(headlineContainer);

headline.addText("Web developer");
headline.addText("Nathan");
headline.type();
