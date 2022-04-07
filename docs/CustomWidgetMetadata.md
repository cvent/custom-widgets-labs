# Custom Widget Metadata

The custom widget metadata object contains the information necessary to retrieve and render your custom widget and editor element. The object contains the following fields:

## `type: string`

This string identifies the "species" of your widget. It must be unique. All custom widgets of the same type will share the same implementation for their widget and editor elements (but each instance will have its own configuration object).
The `type` should be a string without numbers, spaces or special characters.

## `name: string`

This string is the display name for your widget in Site Designer. It appears when hovering over your widget and above your editor element when editing the widget configuration. It will not appear to the registrant.

## `minCellSize: number`

This number describes how many cell widths that a widget occupies on the page. The Site Designer will not allow a widget to be added to the canvas in a space that has fewer available cells than that widget's minimum cell size.

A section in the site has a cell width of 4. A custom widget with a `minCellSize` greater than or equal to 4 will not allow any other elements to be placed alongside it. A `minCellSize` less than 1 will allow more than 4 elements to be placed alongside one another, but these elements may overflow to a second line.

## `customElementName`

This string is used, along with each custom element classes retrieved from the [below URLs](#widgetmoduleurl), to define the custom elements for the custom widget and editor element on the custom element registry of the page. This string is prepended with the widget or editor namespace, so widgets will be defined under the name "widget-{customElementName}" and editors will be defined under "editor-{customElementName}".

This string by itself must be a valid custom element name (see restrictions [here](https://html.spec.whatwg.org/#valid-custom-element-name)). It also must be unique since a custom element name cannot be defined more than once. If two different widget types share the same name, the custom element class that was registered with that name first will be used to create the custom elements for all subsequent elements using that name.

## `widgetModuleUrl`

This URL specifies the location from which the module containing the custom element class should be loaded. The default export of this module should be the definition of the class that is the entry point for your custom widget. This class will receive the custom widget constructor arguments and have the custom widgets SDK methods defined on it as described [here](./CustomWidget.md)

## `editorModuleUrl`

The editor element version of the `widgetModuleURL`. The default export from this module is the entry point class for your editor element. This class may implement editor element callbacks, will receive the editor constructor arguments and have access to the Custom Widgets SDK as described [here](./CustomWidgetEditor.md).
