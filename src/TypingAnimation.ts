type FontStylesObject = {
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  bold?: boolean;
};

type Expression = {
  string: string;
  styles?: FontStylesObject;
};

type PlayOptions = {
  continuous: boolean;
  backspace: boolean;
  newLine: boolean;
};

type Position = "center" | "left" | "right";

export class TypingAnimation {
  #queue: Array<Expression>;
  #fontSize: string;
  #parent: HTMLElement | null;
  #container: HTMLElement;
  #caret: HTMLElement;
  #expressionContainer: Array<HTMLElement>;
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
    this.#expressionContainer = [];

    const container = document.createElement("div");
    container.style.fontSize = this.#fontSize;
    container.style.display = "flex";
    container.style.flexDirection = "column";

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

  position(align: Position, justify: Position) {
    if (align === "center") this.#container.style.alignItems = "center";
    if (align === "left") this.#container.style.alignItems = "flex-end";
    if (align === "right") this.#container.style.alignItems = "flex-start";
    if (justify === "center") this.#container.style.justifyContent = "center";
    if (justify === "left") this.#container.style.justifyContent = "flex-end";
    if (justify === "right")
      this.#container.style.justifyContent = "flex-start";
  }

  #applyStyles(element: HTMLElement) {
    // Change font-size on a pre-span basis rather than the whole container... Or create a new word container for each word... probably the latter
    if (this.#queue[this.#currentExpression].styles?.fontSize !== undefined) {
      this.#expressionContainer[this.#currentExpression].style.fontSize = this
        .#queue[this.#currentExpression].styles?.fontSize as string;
      this.#caret.style.height = this.#queue[this.#currentExpression].styles
        ?.fontSize as string;
    } else {
      this.#expressionContainer[this.#currentExpression].style.fontSize =
        this.#fontSize;
      this.#caret.style.height = this.#fontSize;
    }

    if (this.#queue[this.#currentExpression].styles?.color !== undefined)
      element.style.color = this.#queue[this.#currentExpression].styles
        ?.color as string;

    if (this.#queue[this.#currentExpression].styles?.fontFamily !== undefined)
      element.style.fontFamily = this.#queue[this.#currentExpression].styles
        ?.fontFamily as string;

    if (this.#queue[this.#currentExpression].styles?.bold)
      element.style.fontWeight = "bold";

    if (this.#queue[this.#currentExpression].styles?.underline)
      element.style.textDecoration = "underline";

    if (this.#queue[this.#currentExpression].styles?.strikethrough)
      element.style.textDecoration = "line-through";

    if (this.#queue[this.#currentExpression].styles?.italic)
      element.style.fontStyle = "italic";
  }

  addText(expression: Expression) {
    this.#queue.push(expression);
  }

  #createWordContainer() {
    const expressionContainer = document.createElement("div");
    expressionContainer.style.display = "flex";
    expressionContainer.style.alignItems = "center";
    expressionContainer.appendChild(this.#caret);
    this.#expressionContainer.push(expressionContainer);
    this.#container.appendChild(
      this.#expressionContainer[this.#expressionContainer.length - 1]
    );
    return expressionContainer;
  }

  #createLetterElement(letter: string) {
    const letterElement = document.createElement("span");
    this.#applyStyles(letterElement);
    letterElement.innerText = letter;
    return letterElement;
  }

  #typeText() {
    this.#caret.style.animationPlayState = "paused";
    this.#createWordContainer();
    this.#queue[this.#currentExpression].string
      .split("")
      .forEach((letter, i) => {
        setTimeout(() => {
          const letterElement = this.#createLetterElement(letter);
          this.#expressionContainer[this.#currentExpression].append(
            letterElement
          );
          this.#expressionContainer[this.#currentExpression].append(
            this.#caret
          );
        }, this.#typingSpeed * i);
      });
  }

  #backspaceText() {
    this.#queue[this.#currentExpression].string.split("").forEach((_, i) => {
      setTimeout(() => {
        this.#expressionContainer[this.#currentExpression].lastChild?.remove();
      }, this.#backspaceSpeed * i);
    });
  }

  play(options: PlayOptions) {
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

    this.#typeText();
    if (options.backspace) {
      setTimeout(() => {
        this.#backspaceText();
      }, this.#queue[this.#currentExpression].string.length * this.#typingSpeed + this.#typingSpeed);
    }

    setTimeout(
      () => {
        this.#currentExpression++;
        this.play(options);
      },
      options.backspace
        ? this.#typingSpeed *
            this.#queue[this.#currentExpression].string.length +
            this.#backspaceSpeed *
              this.#queue[this.#currentExpression].string.length +
            this.#typingSpeed
        : this.#typingSpeed *
            this.#queue[this.#currentExpression].string.length +
            this.#typingSpeed
    );
  }
}
