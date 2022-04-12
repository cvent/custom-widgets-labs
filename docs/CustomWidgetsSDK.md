# Custom Widget SDK Overview

The custom widget SDK exposes functionality from the Cvent platform to the widget and editor elements. These functions are defined on the CE class for each element.

# Methods

## `getEventTitle()`

Retrieves the title of the event
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

## `getSessionGenerator(sort?, pageSize?)`

Returns an [asynchronous generator](https://javascript.info/async-iterators-generators) that retrieves information about the sessions in the event. Queries to retrieve sessions are paginated— the generator will yield the next batch of sessions until all sessions have been retrieved.

| Async? |
| ---------------------- |
|yes|

|Parameters | Possible Values| Description       |
|-------------|----------|---------|
|`sort?`| `"dateTimeAsc"`, `"dateTimeDesc"`, `"nameAsc"`, `"nameDesc"` | Specifies the order that sessions should be returned in. If `sort` is omitted or if the provided string does not match one of the possible values, sessions will be returned in ascending order according to the value of their start dateTime (`"dateTimeAsc"`)
|`pageSize?`| 1 ≤ `pageSize` ≤ 50| Specifies the maximum number of sessions to be returned in a single result. For values exceeding the limit of 50, the generator will return up to 50 sessions. If this parameter is omitted, the default `pageSize` of 10 will be used. Any value less than or equal to 1 will retrieve a single session on each call.

| Return Type | Description       |
|-------------|-------------------|
| `AsyncGenerator`| An asynchronous generator function that handles the pagination of requests.  |

The generator yields an object with the following fields:

|  Field Name |Field Type      | Description       |
|-------------|-------------------|----------|
| `sessions`| an array of `SessionDetail` objects| An array of objects that contain properties describing a single session. Will be an empty array `[]` if an error occurs.|
| `totalSessions`| Integer| The total number of sessions that exist in the event. Will be `null` if an error occurs.|
| `error`| Boolean | Indicates whether an error occurred while retrieving the session data.|

### Using The Session Generator

To trigger a single paginated query for session data, call the `next` method on the generator ([see here](https://javascript.info/async-iterators-generators)). The `value` property on the promised result will contain the `sessions`, `totalSessions` and `error` properties. Once all sessions that exist for the event have been retrieved, the `done` property in all subsequent results will be `true`.

```javascript
// create a generator, omitting parameters to use the defaults
const sessionGenerator = await this.getSessionGenerator();

const page0 =  await sessionGenerator.next(); // returns 10 sessions
// {value:{sessions:[...], totalSessions:17, error: false}, done: false}

const page1 =  await sessionGenerator.next(); // returns 7 sessions
// {value:{sessions:[...], totalSessions:17, error: false}, done: false}

const page2 =  await sessionGenerator.next(); 
// {value: undefined, done: true}
```

A `for await...of` loop can be used to succinctly retrieve all of the sessions:

```javascript
// retrieve the maximum number of sessions in each query, return results in alphabetical order by session name
    const sessionGenerator = await this.getSessionGenerator("nameAsc", 50);
    const sessions = [];
    for await (const page of sessionGenerator) {
      sessions.push(...page.sessions);
    }
```

### The `SessionDetail` Object

Conforms to the below typescript type. `Maybe<T>` indicates that a field is possibly null.

```typescript
type Maybe<T> = T | null;

type SessionDetail = {
    // Unique identifier for session
    id: string;
    //Name/Title of the session
    name: string;
    // Code for session
    code: string;
    // Is this session optional or included?
    isIncludedSession: boolean;
    // Date object for session start
    startDateTime: Date;
    // Date object for session end
    endDateTime: Date;
    // Plain text description of the session
    description: string;
    location: Maybe<SessionLocation>;
    category: Maybe<SessionCategory>;
    speakers: Speaker[];
};

type SessionLocation = {
    // Unique session location identifier
    id: string;
    name: string;
    //Planner-defined session code
    code: string;
};

type SessionCategory = {
    // Unique session category identifier
    id: string;
    name: string;
    description: string;
};

// Information about a particular speaker
type Speaker = {
    // Unique speaker identifier
    id: string;
    firstName: string;
    lastName: string;
    company: Maybe<string>;
    title: Maybe<string>;
    facebookUrl: Maybe<string>;
    linkedInUrl: Maybe<string>;
    twitterUrl: Maybe<string>;
    displayOnWebsite: boolean;
    biography: Maybe<string>;
    profilePictureUri: Maybe<string>;
};
```

---------------------------------------------------------
