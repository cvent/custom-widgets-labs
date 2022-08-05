export default class extends HTMLElement {
  constructor({ configuration, theme }) {
    super();

    // store theme and configuration for later use
    this.configuration = configuration;
    this.theme = theme;

    // Create a shadow root
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    // title header
    const header = document.createElement("h1");
    header.textContent = await this.getEventTitle();
    header.style.color = this.theme.palette.textAccent;
    header.style.paddingTop = "40px";

    // sub heading
    const subHeading = document.createElement("h4");
    subHeading.textContent = this.configuration?.subheading;
    subHeading.style.color = this.theme.palette.textAccent;

    // title container with background that uses the event theme

    const container = document.createElement("div");
    container.style.height = "200px";
    container.style.width = "100%";
    container.style.background = `radial-gradient(ellipse at 20% 20%, ${this.theme.palette.accent} 0%, transparent 70%),radial-gradient(ellipse at 60% 20%, ${this.theme.palette.primary}  0%, transparent 70%),radial-gradient(ellipse at 100% 20%, ${this.theme.palette.secondary}  0%, transparent 70%),radial-gradient(ellipse at 100% 100%, ${this.theme.palette.text}  0%, transparent 70%),radial-gradient(ellipse at 20% 100%, ${this.theme.palette.textAccent}  0%, transparent 70%)`;
    container.style.textAlign = "center";

    container.append(header, subHeading);

    this.shadowRoot.append(container);
  }
}
