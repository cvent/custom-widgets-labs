# Creating and Publishing a Custom Widget

During our current phase of development, widgets are hosted outside of Cvent. We will have a hosting solution in place prior to release.

## Step 1: Upload a Widget to a Hosting Solution
Create a widget as described [here](./CustomWidget.md) and an editor as described [here](./CustomWidgetEditor.md). Upload those to any hosting solution (S3 bucket with Cloudfront, github repository, etc.).

## Step 2: Publish the Widget

Custom widgets are published via a POST call to the custom widgets service.

The url is https://event-custom-widgets-service.us-east-1.cvent-event-prod.cvent.cloud/pr50/event-custom-widgets/v1/

For authentication, we need a bearer token. A bearer token can be retrieved by logging into planner side and copying the value of the `cvent-auth` cookie. This will be moved more in line with the Cvent Rest API before release. This needs to be added to the Authorization header with the value "BEARER {token}"

The endpoint takes a list of widgets. The fields are the metadata described [here](./CustomWidgetMetadata.md).

The body of the post is an array of widgets, such as:
```
[
    {
        "widgetId": "48f22f1d-cb7c-4002-99e5-58f6dc52def1",
        "type": "FeaturedSession",
        "name": "Feature Session",
        "minCellSize": 1,
        "customElementName": "featured-session",
        "widgetModuleUrl": "https://cvent.github.io/custom-widgets-labs/examples/FeaturedSessionWidget/src/index.js",
        "editorModuleUrl": "https://cvent.github.io/custom-widgets-labs/examples/FeaturedSessionWidget/configuration/index.js"
    }
]
```

The above example curl will publish Cvent's sample widget to your account.

[TODO] - the widget doesn't work until we update it to reflect the changes to the session sdk

Widgets in the post body are matched to existing widget by widgetId, widgets that do not match are added. We currently use the provided id in those cases, but in the future we will likely generate a new id on create for security.

Upon publishing, your widget should be available in the site designer immediately (page refresh required if you're already logged in).

A list of existing widgets can be retrieved via a GET call to the same url.