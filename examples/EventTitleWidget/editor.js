export default class extends HTMLElement {
  constructor({ setConfiguration, initialConfiguration }) {
    super();

    // Create a shadow root
    this.attachShadow({ mode: "open" });

    // header
    const header = document.createElement("h1");
    header.textContent = "Event Title Widget Editor";

    //text input descriptor
    const subheadingDescriptor = document.createElement("h3");
    subheadingDescriptor.textContent = "Provide a subheading for your widget: ";

    //text input for sub header
    var textInput = document.createElement("input");
    textInput.type = "text";

    //Editor save button
    const saveConfigButton = document.createElement("button");
    saveConfigButton.textContent = "Save";
    saveConfigButton.onclick = () => {
      console.log("saving: " + textInput.value);
      setConfiguration({ subheading: textInput.value });
    };

    this.shadowRoot.append(
      header,
      subheadingDescriptor,
      textInput,
      saveConfigButton
    );
  }
}
