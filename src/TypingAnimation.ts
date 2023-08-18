export class TypingAnimation {
  #caretId: string;
  #queue: Array<string>;
  #fontSize: string;
  #parent: HTMLElement | null;
  #container: HTMLElement;
  #caret: HTMLElement;
  #wordContainer: HTMLElement;
  #typingSpeed: number;

  constructor(parent: HTMLElement | null) {
    let randomNumber = Math.floor(Math.random() * 1000000);
    this.#caretId = `caret${randomNumber}`;
    this.#queue = [];
    this.#fontSize = "64px";
    this.#parent = parent;
    this.#typingSpeed = 250;

    const container = document.createElement("div");
    container.style.fontSize = this.#fontSize;
    container.style.display = "flex";
    container.style.alignItems = "center";

    const caret = document.createElement("div");
    caret.id = this.#caretId;
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

    const wordContainer = document.createElement("div");

    container.appendChild(wordContainer);
    container.appendChild(caret);
    this.#caret = caret;
    this.#container = container;
    this.#wordContainer = wordContainer;

    if (this.#parent) this.#parent.appendChild(this.#container);
  }

  setFontSize(size: string) {
    this.#container.style.fontSize = size;
    this.#caret.style.height = size;
    this.#fontSize = size;
  }

  addText(text: string) {
    this.#queue.push(text);
  }

  backspace() {
    while (this.#wordContainer.hasChildNodes()) {
      setTimeout(() => {
        this.#wordContainer.lastChild?.remove();
      }, this.#typingSpeed);
    }
  }

  type() {
    this.#queue.forEach((string, i) => {
      setTimeout(
        () => {
          this.animateText(string);
        },
        i === 0
          ? this.#typingSpeed
          : (this.#queue[i - 1].length * this.#typingSpeed +
              this.#typingSpeed) *
              2
      );
      setTimeout(
        () => {
          this.backspace();
        },
        i === 0
          ? this.#typingSpeed
          : this.#queue[i - 1].length * this.#typingSpeed +
              this.#typingSpeed * 2
      );
    });
  }

  animateText(text: string) {
    const wordArray: Array<string> = text.split("");
    wordArray.forEach((letter, i) => {
      this.#animateTextHelper(letter, i, text.length);
    });
  }

  #animateTextHelper(char: string, charNum: number, textLength: number) {
    setTimeout(() => {
      this.#wordContainer.append(char);
      //if (charNum === textLength) this.#playCaretAnimation();
    }, this.#typingSpeed * (charNum + 1));
  }
}
