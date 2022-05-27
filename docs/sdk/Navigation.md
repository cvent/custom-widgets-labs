# Navigation (Upcoming)

The registration process features a linear navigation flow (forward/back). Custom Widgets will need to be able to interact with this flow in a few ways. The first way is going to be to prevent navigation. This will let custom widgets prevent navigation pending the user's completion of some action.

_Note: this is an entirely client side feature and should be used for the sake of user experience, not any sort of security_

The Navigation API is available on the object returned from the SDK's navigation field, `this.cventSdk.navigation`.

# Methods

## `navigation.setIsValid(valid: boolean)`
This method sets the validity of the widget. If a custom widget is set as invalid by calling `this.navigation.setIsValid(false)`, then navigation will be prevented.

Once navigation has been prevented, the application will scroll to the first invalid widget, which may be a custom widget or a standard widget. If it is a custom widget, then the application will call that widget's `focusOnFailedNavigation` method if it exists.

| Async? |
| ---------------------- |
|no|

|Parameters | Description       |
|-------------|-------------------|
|valid| True for valid, false if the widget is invalid.

| Return Type | Description       |
|-------------|-------------------|
| `void`| This method returns nothing |

### Example Usage

```javascript
class NavigationWidget extends HTMLElement {
  constructor({ configuration }) {
    super();
    this.configuration = configuration ?? { required: true };
    
    // Create a shadow root
    this.attachShadow({ mode: "open" });

    this.input = document.createElement('input');
    this.shadowRoot.appendChild(this.input);

    // configuration can't change on guest side
    // and navigation validation isn't enabled in the designer
    if (this.configuration.required) {
      const navigatorPromise = this.cventSdk.getNavigator();
      const requiredInput = this.input;
      navigatorPromise.then(navigator => {
        // since our example widget always starts blank, we set it to
        // invalid based on that initial state
        navigator.setIsValid(false);
        requiredInput.onchange = (_event) => {
          navigator.setIsValid(Boolean(requiredInput.value));
        };

      });
    }
  }
}

```

## `navigation.registerNavigationValidator(...)`

Navigation Validators give you a way to run asynchronous validation. This method registers a handler that can validate whether we navigation should proceed when the user clicks Next/Submit. This returns a function that will remove the handler.

It is possible in some cases that a custom element can be removed and readded to the DOM, in which case connectedCallback and disconnectedCallback can be called multiple times.

_Note: we do not think that Cvent Custom Elements will be removed and readded, since we do not do that sort of DOM manipulation. We are still confirming this._

| Async? |
| ---------------------- |
|no|

|Parameters | Description       |
|-------------|-------------------|
|validator| The function to run when the user attempts to navigate. This returns `true` to allow navigation and `false` to prevent navigation.

| Return Type | Description       |
|-------------|-------------------|
| `() => void`| A function that will remove this validator. This should usually be called in the disconnected callback. |

### Example Usage

```javascript
class MyCustomWidget extends HTMLElement {
  disconnectedCallback() {
    this.cleanup?();
    this.cleanup = null;
  }

  async connectedCallback() {
    if (!this.isConnected) {
      // do not register callback if the node has been disconnected
      return;
    }
    const navigation = await this.cventSdk.getNavigator();
    const validate = async onSubmit => {
      const response = await callSomeService(this.config.exampleField);

      const responseObject = await response.json();

      return responseObject.isValid;
    }
    this.cleanup = navigation.registerNavigationValidator(validate);
  }
}

```
