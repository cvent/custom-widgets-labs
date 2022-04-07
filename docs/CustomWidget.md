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

Accessory CEs must be defined in the document's custom element registry using a valid name that does not conflict with the name of a custom element for _any_ custom widget. Always check whether the accessory CE has already been defined by another instance of the widget element, attempting to define an element twice will result in an error.

## Using Shadow DOM

The Web Components standard includes the shadow dom feature which can be used to encapsulate the scripting and styling of the custom element to prevent interference with other aspects fo the registration site.

```Javascript
export default class FeaturedSessionWidget extends HTMLElement {
    constructor({ configuration, theme }) {
        super();
        // Create a shadow root
        this.attachShadow({ mode: "open" });

        const hello = document.createElement('h1');
        hello.textContent = "Hello World"

        // append an element to the shadow root
        this.shadowRoot.appendChild(hello);
    }
}
```
