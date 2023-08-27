import { TypingAnimation } from "./TypingAnimation";

const headlineContainer = document.getElementById("app");

const headline = new TypingAnimation(headlineContainer);

headline.addText("Nathan");
headline.play();
