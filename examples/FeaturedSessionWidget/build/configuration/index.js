class ExampleCustomEditor extends HTMLElement {
  _config = null;

  /**
   * Arguments that allow for displaying and updating the configuration for a custom widget.
   * Any value set as the configuration by this editor CE will be passed directly to the constructor for
   * the widget CE as the value of `configuration`
   * @param setConfiguration function that sets a value as the widget configuration in the site designer
   * @param initialConfiguration the initial configuration value for the widget
   */
  constructor({ setConfiguration, initialConfiguration }) {
    super();
    this.setConfiguration = setConfiguration;

    if (!initialConfiguration) {
      setConfiguration({ featuredSessionIds: [] });
    } else {
      // initialize the local config state with the initial value
      this._config = initialConfiguration;
    }

    // header
    const header = document.createElement("h2");
    header.textContent = "Select which sessions you'd like to feature: ";
    header.style.margin = "0";
    header.style.fontFamily = "Rubik";
    // sub header
    const subHeader = document.createElement("p");
    subHeader.textContent = "(limit 3)";
    subHeader.style.margin = "0";
    subHeader.style.fontFamily = "Rubik";

    this.themeOverrideContainer = document.createElement("div");
    this.sessionSelectorContainer = document.createElement("div");

    // Create a shadow root
    this.attachShadow({ mode: "open" });
    // add our elements to shadow dom
    this.shadowRoot.append(
      header,
      subHeader,
      this.sessionSelectorContainer,
      this.themeOverrideContainer
    );
  }

  onClickSession = (sessionId) => {
    let featuredSessionIds = this._config.featuredSessionIds
      ? [...this._config.featuredSessionIds]
      : [];

    const sessionIdIndex = featuredSessionIds.findIndex((id) => {
      return sessionId === id;
    });

    if (sessionIdIndex === -1) {
      // this sessionId was not already selected, add it and maintain the limit of 3 featured sessions
      featuredSessionIds.push(sessionId);
      if (featuredSessionIds.length > 3) {
        featuredSessionIds.shift();
      }
    } else {
      // this sessionId was found in the selected ids, remove it
      featuredSessionIds.splice(sessionIdIndex, 1);
    }

    this.setConfiguration({ featuredSessionIds });
  };

  // create a set of radio buttons for selecting a session and append them to the container
  createSessionSelectors = () => {
    const allSessions = Object.values(this.sessionDetails ?? {});

    const featuredSessionIds = this._config.featuredSessionIds ?? [];

    const newSessionButtons = allSessions.map((session) => {
      //create a button for this session
      const button = document.createElement("button");
      button.textContent = session.name;
      button.onclick = () => {
        this.onClickSession(session.id);
      };
      button.style.display = "block";
      button.style.width = "100%";
      button.style.height = "32px";
      button.style.margin = "20px 20px 20px 0px";
      button.style.fontFamily = "Rubik";

      if (featuredSessionIds.includes(session.id)) {
        //style as selected
        button.style.border = "2px solid #016AE1";
        button.style.borderRadius = "8px";
      } else {
        // style as unselected
      }
      return button;
    });

    this.sessionSelectorContainer.replaceChildren(...newSessionButtons);
  };

  // When this callback method is defined, it will be called by the site designer application every time the widget configuration changes
  onConfigurationUpdate(newConfig) {
    this._config = newConfig;
    this.createSessionSelectors();
    this.createThemeOverrides();
  }

  createColorPicker(title, colorCode, initialValue) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "flex-end";
    container.style.marginBottom = "10px";

    const colorName = document.createElement("p");
    colorName.textContent = title;
    colorName.style.margin = "0px 10px 0px 0px";

    const colorPicker = document.createElement("input");
    colorPicker.style.width = "32px";
    colorPicker.style.height = "32px";
    colorPicker.style.padding = "2px";
    colorPicker.setAttribute("type", "color");
    colorPicker.setAttribute("value", initialValue);

    colorPicker.onchange = () => {
      const newConfig = {
        ...this._config,
        customColors: { ...this._config.customColors },
      };
      newConfig.customColors[colorCode] = colorPicker.value;
      this.setConfiguration(newConfig);
    };

    // Clear the config setting for this color code if we should use the event theme.
    const button = document.createElement("button");
    button.textContent = "Use Event Theme";
    button.onclick = () => {
      const newConfig = {
        ...this._config,
        customColors: { ...this._config.customColors },
      };
      newConfig.customColors[colorCode] = undefined;
      this.setConfiguration(newConfig);
    };

    if (
      !this._config.customColors ||
      this._config.customColors[colorCode] === undefined
    ) {
      //style as selected
      button.style.border = "2px solid #016AE1";
      button.style.borderRadius = "8px";
    }

    button.style.margin = "0px 0px 0px 10px";

    container.append(colorName, colorPicker, button);
    return container;
  }

  createThemeOverrides() {
    const themeHeader = document.createElement("h2");
    themeHeader.textContent = "Event Theme Overrides: ";
    themeHeader.style.fontFamily = "Rubik";

    this.themeOverrideContainer.replaceChildren(
      themeHeader,
      this.createColorPicker(
        "Background Color",
        "background",
        this._config.customColors?.background ?? "#FFFFFF"
      ),
      this.createColorPicker(
        "Primary Text Color",
        "textPrimary",
        this._config.customColors?.textPrimary ?? "#000000"
      ),
      this.createColorPicker(
        "Secondary Text Color",
        "textSecondary",
        this._config.customColors?.textSecondary ?? "#b8b8b8"
      )
    );
  }

  async connectedCallback() {
    this.sessionDetails = await this.getSessionDetails();

    this.createSessionSelectors();

    this.createThemeOverrides();
  }
}
export default ExampleCustomEditor;
