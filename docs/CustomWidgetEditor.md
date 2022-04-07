# The Editor Element

The editor element has the ability to set the custom configuration fields that are passed to the widget element.

The editor element is displayed in Site Designer whenever a custom widget is added to the site canvas or after clicking on a widget in the canvas. The configuration values that are set for this widget are stored permanently in a site version upon publishing or saving the site.

This widget will never be registrant-facing and should be built with the "event planner" persona in mind.

Like the widget element, the editor element has access to the [custom widgets SDK](./CustomWidgetsSDK.md) and is provided with several constructor parameters that provide a way to update the widget configuration.

## Constructor Parameters

These are provided as fields in an object that is the sole parameter to the CE constructor.

### `initialConfiguration`

This field contains the value of the widget configuration at the point in time when the editor element's constructor was called. I's value is an empty object `{}` by default

### `setConfiguration(newValue)`

This function overwrites the existing widget configuration with whatever value is passed as the argument.

In Site Designer, changes to the widget configuration (or the event theme) are reflected immediately in the canvas for the widget that they apply to.

```Javascript
export default class FeaturedSessionWidgetEditor extends HTMLElement {
    let featuredSessionIds = [];
    constructor({ initialConfiguration, setConfiguration }) {
        super();
        // Create a shadow root
        this.attachShadow({ mode: "open" });

        // initialize our local configuration value
        this.featuredSessionIds = initialConfiguration.featuredSessionIds ?? [];

        // store our setConfiguration() function for later use
        this.setConfig = setConfiguration;
    }
}
```

## Accessing the Custom Widgets SDK

Like the widget element, SDK methods are defined on the CE class. See [here](./CustomWidget.md#accessSDK)

## Editor Callbacks

The editor element may optionally implement a method `onConfigurationUpdate` that is called whenever the value of a custom widget's configuration changes. This usually results from the editor element calling the `setConfiguration` function but may also result from an undo/redo action or a site version change. This function can be used to keep some state variable in your editor CE class up to date with the latest configuration, or trigger a refresh of the UI in the editor element.

Note: this method will be called when the editor element is first added to the document, possibly before the `connectedCallback` lifecycle method is called.

## Example

This example demonstrates the use of the constructor parameters, the custom widgets SDK and `onConfigurationUpdate` callback to create a responsive editor element.

```Javascript
// an editor element that provides the event planner with a way to select several "featured" sessions
export default class FeaturedSessionWidgetEditor extends HTMLElement {
    // a list of session ids that we want to feature
    // this will be a part of the widget configuration
    let featuredSessionIds = [];
    constructor({ initialConfiguration, setConfiguration }) {
        super();
        // Create a shadow root
        this.attachShadow({ mode: "open" });

        // initialize our local configuration value
        this.featuredSessionIds = initialConfiguration.featuredSessionIds ?? [];

        // store our setConfiguration() function for later use
        this.setConfig = setConfiguration;
    }
    
    // Function that creates a collection of selector buttons, one for each session. 
    // On click, the button will update the configuration to include the session id in featuredSessionIds
    createSessionSelectionButtons() {
        // for each session...
       return Object.values(this.sessionDetails).map((session) => {
            // create a button that adds a session id to the list of featured session ids in the widget configuration
            const btn = document.createElement('button');
            btn.textContent = session.name;
            btn.onClick = () => {
                this.setConfig({featuredSessionIds: [...this.featuredSessionIds, session.id]})
            };
        });
    }

    // once our element is added to the document...
    async connectedCallback() {
        // access a method from the SDK and store the result
        this.sessionDetails = await this.getSessionDetails();
        // create the user interface
        this.shadowRoot.replaceChildren(createSessionSelectionButtons())
    }

    // whenever the configuration changes...
    onConfigurationUpdate(newConfig) {
        // update our class variable
        this.featuredSessionIds = newConfig.featuredSessionIds;
        // update the UI
        this.shadowRoot.replaceChildren(createSessionSelectionButtons())
    }

}
```
