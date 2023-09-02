type FontStylesObject = {
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  bold?: boolean;
};

type PlayOptions = {
  continuous: boolean;
  backspace: boolean;
  newLine: boolean;
};

type Position = "center" | "left" | "right";

class Expression {
  #string: string;
  #styles: FontStylesObject;
  #container: HTMLElement;

  constructor(string: string, styles?: FontStylesObject) {
    this.#string = string;
    this.#styles = styles ? styles : {};
    this.#container = document.createElement("div");
    this.#container.style.display = "flex";
    this.#container.style.alignItems = "center";
  }

  getString() {
    return this.#string;
  }

  getContainer() {
    return this.#container;
  }

  getStyles() {
    return this.#styles;
  }

  setStyles(styles: FontStylesObject) {
    this.#styles = styles;
  }

  applyStyles() {
    if (this.#styles?.fontSize !== undefined)
      this.#container.style.fontSize = this.#styles?.fontSize as string;

    if (this.#styles?.color !== undefined)
      this.#container.style.color = this.#styles?.color as string;

    if (this.#styles?.fontFamily !== undefined)
      this.#container.style.fontFamily = this.#styles?.fontFamily as string;

    if (this.#styles?.bold) this.#container.style.fontWeight = "bold";

    if (this.#styles?.underline)
      this.#container.style.textDecoration = "underline";

    if (this.#styles?.strikethrough)
      this.#container.style.textDecoration = "line-through";

    if (this.#styles?.italic) this.#container.style.fontStyle = "italic";
  }
}

export class TypingAnimation {
  #queue: Array<Expression>;
  #fontSize: string;
  #parent: HTMLElement | null;
  #container: HTMLElement;
  #caret: HTMLElement;
  #typingSpeed: number;
  #backspaceSpeed: number;
  #currentExpression: number;

  constructor(parent?: HTMLElement | null) {
    this.#queue = [];
    this.#fontSize = "3rem";
    this.#parent = parent ? parent : document.body;
    this.#typingSpeed = 250;
    this.#backspaceSpeed = 150;
    this.#currentExpression = 0;

    const container = document.createElement("div");
    container.style.fontSize = this.#fontSize;
    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr";

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

    this.#caret = caret;
    this.#container = container;

    if (this.#parent) this.#parent.appendChild(this.#container);
  }

  setFont(styles: FontStylesObject) {
    // Apply styles to all headlines, unless it is set on the Expression
  }

  setFontSize(size: string) {
    this.#container.style.fontSize = size;
    this.#caret.style.height = size;
    this.#fontSize = size;
  }

  setFontFamily(fontFamily: string) {
    this.#container.style.fontFamily = fontFamily;
  }

  setColor(color: string) {
    this.#container.style.color = color;
  }

  italic() {
    this.#container.style.fontStyle = "italic";
  }

  underline() {
    this.#container.style.textDecoration = "underline";
  }

  strikethrough() {
    this.#container.style.textDecoration = "line-through";
  }

  bold() {
    this.#container.style.fontWeight = "bold";
  }

  position(justify?: Position) {
    if (justify === "center") this.#container.style.justifyItems = "center";
    if (justify === "left") this.#container.style.justifyItems = "start";
    if (justify === "right") this.#container.style.justifyItems = "end";
  }

  addText(expression: string, styles?: FontStylesObject) {
    if (styles !== undefined) {
      const newExpression = new Expression(expression, styles);
      this.#queue.push(newExpression);
      return;
    }
    const newExpression = new Expression(expression);
    this.#queue.push(newExpression);
    return;
  }

  #createLetterElement(letter: string) {
    const letterElement = document.createElement("span");
    letterElement.innerText = letter;
    return letterElement;
  }

  #typeText() {
    this.#caret.style.animationPlayState = "paused";
    this.#queue[this.#currentExpression].applyStyles();
    this.#queue[this.#currentExpression]
      .getContainer()
      .appendChild(this.#caret);
    this.#container.appendChild(
      this.#queue[this.#currentExpression].getContainer()
    );
    this.#queue[this.#currentExpression]
      .getString()
      .split("")
      .forEach((letter, i) => {
        setTimeout(() => {
          const letterElement = this.#createLetterElement(letter);
          this.#queue[this.#currentExpression]
            .getContainer()
            .append(letterElement);
          this.#queue[this.#currentExpression]
            .getContainer()
            .append(this.#caret);
        }, this.#typingSpeed * i);
      });
  }

  #backspaceText() {
    this.#queue[this.#currentExpression]
      .getString()
      .split("")
      .forEach((_, i) => {
        setTimeout(() => {
          this.#queue[this.#currentExpression]
            .getContainer()
            .children[
              this.#queue[this.#currentExpression].getContainer()
                .childElementCount - 2
            ].remove();
        }, this.#backspaceSpeed * i);
      });
  }

  play(options: PlayOptions) {
    if (!options.newLine) {
      this.#container.style.height = this.#fontSize;
    }

    if (this.#currentExpression === 0 && !options.newLine) {
      this.#container.style.flexDirection = "row";
    }

    if (this.#queue.length === 0) {
      console.error(
        "Add text using the addText function to play the animation."
      );
      return;
    }

    if (this.#currentExpression === this.#queue.length) {
      if (!options.continuous) return; //we want the animation to stop
      this.#currentExpression = 0; //we want the animation to loop
    }

    this.#queue[this.#currentExpression].getStyles().fontSize !== undefined
      ? (this.#caret.style.height = this.#queue[
          this.#currentExpression
        ].getStyles().fontSize as string)
      : this.#fontSize;
    this.#typeText();
    if (options.backspace) {
      setTimeout(() => {
        this.#backspaceText();
      }, this.#queue[this.#currentExpression].getString().length * this.#typingSpeed + this.#typingSpeed);
    }

    setTimeout(
      () => {
        this.#currentExpression++;
        this.play(options);
      },
      options.backspace
        ? this.#typingSpeed *
            this.#queue[this.#currentExpression].getString().length +
            this.#backspaceSpeed *
              this.#queue[this.#currentExpression].getString().length +
            this.#typingSpeed
        : this.#typingSpeed *
            this.#queue[this.#currentExpression].getString().length +
            this.#typingSpeed
    );
  }
}
