import { FeaturedSession } from "./FeaturedSession.js";

export default class extends HTMLElement {
  images = [
    "https://d3auq6qtr2422x.cloudfront.net/images/bill-hamway-2pW3U_0rT1U-unsplash.jpeg",
    "https://d3auq6qtr2422x.cloudfront.net/images/christian-holzinger-ROJi8Uo4MpA-unsplash.jpeg",
    "https://d3auq6qtr2422x.cloudfront.net/images/chuttersnap-Q_KdjKxntH8-unsplash.jpeg",
  ];

  constructor({ configuration, theme }) {
    super();

    this.configuration = configuration;

    // store the entire theme for use elsewhere in our custom element
    this.theme = theme;

    // Create a shadow root
    this.attachShadow({ mode: "open" });

    // attempting to define this custom element a second time (e.g. having two copies of this widget)
    // will cause an error
    if (!customElements.get("featured-session")) {
      // define a custom element that we will use to display each featured session
      customElements.define("featured-session", FeaturedSession, {
        extends: "div",
      });
    }
  }

  async connectedCallback() {
    const sessionDetails = await this.getSessionDetails();

    const featuredSessionContainer = document.createElement("div");
    featuredSessionContainer.style.display = "flex";
    featuredSessionContainer.style.width = "100%";

    const featuredSessionIds = this.configuration.featuredSessionIds ?? [];

    const featuredSessions = featuredSessionIds.map((sessionId) => {
      return sessionDetails[sessionId];
    });

    const placeholderDiv = document.createElement("div");
    placeholderDiv.style.height = "450px";
    placeholderDiv.style.width = "0px";

    featuredSessionContainer.appendChild(placeholderDiv);

    Object.values(featuredSessions).forEach((session) => {
      const block = new FeaturedSession(
        session,
        this.theme,
        this.configuration,
        this.images.pop()
      );
      featuredSessionContainer.appendChild(block);
    });

    this.shadowRoot.appendChild(featuredSessionContainer);
  }
}
