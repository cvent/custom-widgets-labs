// import another custom element that handles a portion of the UI
// Note: this import must include the file extension
import { FeaturedSession } from "./FeaturedSession.js";

// the custom element entry point for the widget element
export default class extends HTMLElement {
  images = [
    "https://d3auq6qtr2422x.cloudfront.net/images/bill-hamway-2pW3U_0rT1U-unsplash.jpeg",
    "https://d3auq6qtr2422x.cloudfront.net/images/christian-holzinger-ROJi8Uo4MpA-unsplash.jpeg",
    "https://d3auq6qtr2422x.cloudfront.net/images/chuttersnap-Q_KdjKxntH8-unsplash.jpeg",
  ];

  constructor({ configuration, theme }) {
    super();
    // store theme and configuration for later use
    this.configuration = configuration;
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
    // container for the featured session cards
    const featuredSessionContainer = document.createElement("div");
    featuredSessionContainer.style.display = "flex";
    featuredSessionContainer.style.width = "100%";

    // placeholder so that our element doesn't render without height in the editor before we've added sessions
    const placeholderDiv = document.createElement("div");
    placeholderDiv.style.height = "200px";
    placeholderDiv.style.width = "0px";
    featuredSessionContainer.appendChild(placeholderDiv);

    //get our array of featured session ids
    const featuredSessionIds = this.configuration.featuredSessionIds ?? [];

    // create our session generator
    const sessionGenerator = await this.getSessionGenerator("dateTimeDsc", 20);
    const sessions = [];

    // iterate over the generator to get all of our sessions
    for await (const page of sessionGenerator) {
      sessions.push(...page.sessions);
    }

    this.sessionDetails = sessions;

    //create a featured session card for each featured session using  our accessory custom element and session detail information
    featuredSessionIds.forEach((featuredSessionId) => {
      const featuredSession = sessions.find(
        (session) => session.id === featuredSessionId
      );

      if (featuredSession) {
        featuredSessionContainer.appendChild(
          new FeaturedSession(
            featuredSession,
            this.theme,
            this.configuration,
            this.images.pop()
          )
        );
      }
    });

    this.shadowRoot.appendChild(featuredSessionContainer);
  }
}
