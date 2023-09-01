export class TypingAnimation {
  #queue: Array<string>;
  #fontSize: string;
  #parent: HTMLElement | null;
  #container: HTMLElement;
  #caret: HTMLElement;
  #wordContainer: HTMLElement;
  #typingSpeed: number;
  #backspaceSpeed: number;
  #currentString: number;

  constructor(parent?: HTMLElement | null) {
    this.#queue = [];
    this.#fontSize = "3rem";
    this.#parent = parent ? parent : document.body;
    this.#typingSpeed = 250;
    this.#backspaceSpeed = 150;
    this.#currentString = 0;

    const container = document.createElement("div");
    container.style.fontSize = this.#fontSize;
    container.style.display = "flex";
    container.style.alignItems = "center";

    const caret = document.createElement("div");
    caret.style.display = "inline-block";
    caret.style.width = "2px";
    caret.style.height = this.#fontSize;
    caret.style.backgroundColor = "black";
    caret.animate(
      {
        opacity: [0, 1],
      },
      {
        duration: 1000,
        iterations: Infinity,
        easing: "steps(2, end)",
      }
    );
    caret.style.animationPlayState = "running";

    const wordContainer = document.createElement("div");

    container.appendChild(wordContainer);
    container.appendChild(caret);
    this.#caret = caret;
    this.#container = container;
    this.#wordContainer = wordContainer;

    if (this.#parent) this.#parent.appendChild(this.#container);
  }

  setFont() {}

  setFontSize(size: string) {
    this.#container.style.fontSize = size;
    this.#caret.style.height = size;
    this.#fontSize = size;
  }

  setFontFamily(fontFamily: string) {
    this.#wordContainer.style.fontFamily = fontFamily;
  }

  setColor(color: string) {
    this.#wordContainer.style.color = color;
  }

  italic() {
    this.#wordContainer.style.fontStyle = "italic";
  }

  underline() {
    this.#wordContainer.style.textDecoration = "underline";
  }

  strikethrough() {
    this.#wordContainer.style.textDecoration = "line-through";
  }

  bold() {
    this.#wordContainer.style.fontWeight = "bold";
  }

  addText(string: string) {
    this.#queue.push(string);
  }

  play(continuous: boolean = true, backspace: boolean = true) {
    if (this.#queue.length === 0) {
      console.error(
        "Add text using the addText function to play the animation."
      );
      return;
    }

    if (this.#currentString === this.#queue.length) {
      if (!continuous) return; //we want the animation to stop
      this.#currentString = 0; //we want the animation to loop
    }

    this.#typeText();
    if (backspace) {
      setTimeout(() => {
        this.#backspaceText();
      }, this.#queue[this.#currentString].length * this.#typingSpeed + this.#typingSpeed);
    }

    setTimeout(
      () => {
        this.#currentString++;
        this.play(continuous, backspace);
      },
      backspace
        ? this.#typingSpeed * this.#queue[this.#currentString].length +
            this.#backspaceSpeed * this.#queue[this.#currentString].length +
            this.#typingSpeed
        : this.#typingSpeed * this.#queue[this.#currentString].length +
            this.#typingSpeed
    );
  }

  #createLetterElement(letter: string) {
    const letterElement = document.createElement("span");
    letterElement.innerText = letter;
    return letterElement;
  }

  #typeText() {
    this.#caret.style.animationPlayState = "paused";
    this.#queue[this.#currentString].split("").forEach((letter, i) => {
      setTimeout(() => {
        const letterElement = this.#createLetterElement(letter);
        this.#wordContainer.append(letterElement);
      }, this.#typingSpeed * i);
    });
  }

  #backspaceText() {
    this.#queue[this.#currentString].split("").forEach((_, i) => {
      setTimeout(() => {
        this.#wordContainer.lastChild?.remove();
      }, this.#backspaceSpeed * i);
    });
  }
}
