# Overview

Custom widgets allow 3rd party developers to customize the event registration experience by providing a way to build custom components and integrate them into the registration process for their events.

This documentation assumes a basic understanding of creating, editing and publishing an event registration website on the Cvent platform. A basic technical understanding of Javascript and the [HTML Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard is required as well.

The primary part of a custom widget is the widget element. The widget element is an HTML Custom Element that implements whatever user interface and functionality that you decide that it should have. The widget element is primarily registrant-facing, but will also be shown in the Site Designer canvas when building the site. More information about the widget element can be found [here](./CustomWidget.md).

Each custom widget will also have its own editor element. The purpose of this element is to provide the event planner with a way to edit the custom configuration fields that are passed to the widget element. This element only appears in the Site Designer when editing a custom widget. More information about the editor element can be found [here](./CustomWidgetEditor.md).

A custom widget [metadata object](./CustomWidgetMetadata.md) contains several fields that define information about a widget (e.g. where the editor and widget element code is hosted). This metadata object must be published before a custom widget can be used in your account. More information on publishing a custom widget can be found [here](./Publishing.md).

Both widget elements and editor elements are able to access to the custom widgets SDK. This SDK allows these elements to retrieve information about the event. More information about the custom widgets SDK can be found [here](./CustomWidgetsSDK.md).

You can find an example widget [here](../examples/FeaturedSessionWidget)
