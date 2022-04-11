# Custom Widget SDK Overview

The custom widget SDK exposes functionality from the Cvent platform to the custom elements that make up a custom widget and it's corresponding editor element. These functions are defined on the CE class for the widget and editor elements.

# Methods

## `getEventTitle()`

Returns the title of the event
| Async? |
| ---------------------- |
|yes|

|Parameters | Description       |
|-------------|-------------------|
|N/A| No parameters are supplied to this method |

| Return Type | Description       |
|-------------|-------------------|
| `string`| The title of the event |

### Example Usage

```javascript
const title = await getEventTitle()
```

---------------------------------------------------------

## `getSessionDetails()`

Returns basic information about all of the sessions in the event.

| Async? |
| ---------------------- |
|yes|

|Parameters | Description       |
|-------------|-------------------|
|N/A| No parameters are supplied to this method |

| Return Type | Description       |
|-------------|-------------------|
| `{ SessionId: SessionDetail }`| A dictionary with an entry for each session. A unique UUID for each session is used as a key and associated with a SessionDetail object|

### The Session Detail Object

Conforms to the following typescript type:

```typescript
type SessionDetail = {
    // Unique identifier for session
    id: string;
    // Name/Title of the session
    name: string;
    // Code for session
    code: string;
    // Is this session optional or included?
    isIncludedSession: boolean;
    // Zoned datetime string for session start
    startDateTime: Date;
    // Zoned datetime string for session end
    endDateTime: Date;
    // Plain text description of the session
    description: string;
    // Object describing the session location
    location: {
        name?: string;
        // Unique identifier for session location
        id?: string;
        code?: string;
    };
    // Object describing the session category
    category?: {
        name: string;
        // Unique identifier for session category
        id: string;
        // Plain text description of the session category
        description: string;
    };
}
```

### Example Usage

```javascript
const getSessionNames = async () => {
    const sessions = getSessionDetails();
    await sessions;
    const names = Object.values(sessions).map((sessionDetail) => {
        return sessionDetail.name;
    });

    return names;   
}
```

---------------------------------------------------------
