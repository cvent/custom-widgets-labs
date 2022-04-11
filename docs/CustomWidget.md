# The Custom Widget Element

The widget element is an HTML Custom Element (CE) that implements your widget functionality and should be designed with the "event registrant" persona in mind. The Cvent event registration site framework will render this CE in the registration site and provide it with several pieces of information/functionality from the Cvent Platform.

## Constructor Parameters

These are provided as fields in an object that is the sole parameter to the CE constructor.

### `configuration`

An empty object `{}` by default, but can be set within the editor element to any custom value. This configuration value can be used to provide a unique configuration to each instance of a custom widget.

### `theme`

Provides the CE with aspects of the theme that is used for the entire registration site. The value provided to this parameter comes from the Site Designer framework and _cannot_ be edited by the editor element. It can only be changed by editing the site-wide theme. The value of the `theme` parameter takes the following shape:

```typescript
type Style = {
    // color palette
    palette: { 
        accent: string;
        primary: string;
        secondary: string;
        text: string;
        textAccent: string 
    };
    // fonts, custom fonts may be used
    fontPalette: { 
        primary: string;
        secondary: string;
    };
};
```

### Accessing Constructor Arguments

```Javascript
export default class FeaturedSessionWidget extends HTMLElement {
    constructor({ configuration, theme }) {
        super();
        // store a custom field from our configuration as a class variable
        this.featuredSessionIds = this.configuration.featuredSessionIds ?? [];

        // store the entire theme for use elsewhere in our custom element
        this.theme = theme;
    }
}
```

## Accessing the Custom Widgets SDK <a name="accessSDK"></a>

Behind the scenes, methods in the SDK are provided as mixins to the CE class. This means that the methods defined in the [custom widgets SDK](./CustomWidgetsSDK.md) will also be available as methods on the CE class.

Since the CE constructor cannot await asynchronous function calls, you'll probably want to call these methods elsewhere. One way to do this is by using [HTML custom element lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks). Using the `connectedCallback` lifecycle method, we can call and await an async SDK method when our custom element is added to the document:

```javascript
  async connectedCallback() {
    const sessionDetails = await this.getSessionDetails();
  }
```

## Defining Multiple Custom Elements

You may want to use multiple custom elements to better organize your code for reuse. You can import other CE classes into the file where your entrypoint CE is defined. Be sure to include the `.js` file extension in the import path.

Before they can be used, accessory CEs must be defined on the page's custom element registry using a valid name that does not conflict with the name of a custom element for _any_ custom element used elsewhere on the page. This includes all widget elements, editor elements and accessory elements used in the implementation of a widget or editor element.  Always check whether the accessory CE has already been defined by another instance of the widget element, as attempting to define an element twice will result in an error.

## Shadow DOM

The Web Components standard includes the shadow dom feature which can be used to encapsulate the scripting and styling of the custom element to prevent interference with other aspects fo the registration site.

## Example

This example demonstrates the use of the constructor parameters, the custom widgets SDK and the Web Components shadow dom feature to create widget element that displays some featured sessions selected by the planner.

```Javascript
// import an accessory custom element class
// this element creates an site-themed information card for a session
import { FeaturedSession } from "./FeaturedSession.js";

export default class FeaturedSessionWidget extends HTMLElement {
  constructor({ configuration, theme }) {
    super();
    // store the planner-selected session ids from the widget configuration for later use
    this.featuredSessionIds = configuration.featuredSessionIds ?? [];

    // store the theme for later use
    this.theme = theme;

    // Create a shadow root
    this.attachShadow({ mode: "open" });

    const header = document.createElement("h1");
    header.textContent = "Featured Sessions:";
    // style the header using the site-wide theme
    header.style.fontFamily = theme.fontPalette.primary;
    header.style.color = theme.palette.textAccent;

    // append our element to the shadow root
    this.shadowRoot.appendChild(header);

    // check first that this element name has not yet been defined
    if (!customElements.get("featured-session")) {
      // define a custom element that we will use to display each featured session
      customElements.define("featured-session", FeaturedSession, {
        extends: "div",
      });
    }
  }

  async connectedCallback() {
    // fetch information about all sessions
    const sessionDetails = await this.getSessionDetails();

    // create a container to hold our featured session cards
    const featuredSessionContainer = document.createElement("div");

    // for each featured session id from the widget configuration...
    this.featuredSessionIds.forEach((sessionId) => {
      // get the session detail object
      const session = sessionDetails[sessionId];
      // create a FeaturedSession CE using the session detail object and the event theme
      featuredSessionContainer.appendChild(
        new FeaturedSession(session, this.theme) // implementation left to your imagination...
      );
    });

    // add our container to the document
    this.shadowRoot.appendChild(featuredSessionContainer);
  }
}

```
