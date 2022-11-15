# Custom Widget SDK Overview

The custom widget SDK exposes functionality from the Cvent platform to the widget and editor elements. These functions are defined on the cventSdk field added to the Custom Element class for each element.

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
const title = await this.cventSdk.getEventTitle()
```

---------------------------------------------------------

## `getSessionGenerator(sort?, pageSize?, filters?)`

Returns an [asynchronous generator](https://javascript.info/async-iterators-generators) that retrieves information about the sessions in the event. Queries to retrieve sessions are paginated— the generator will yield the next batch of sessions until all sessions have been retrieved.

| Async? |
| ---------------------- |
|yes|

|Parameters | Possible Values| Description       |
|-------------|----------|---------|
|`sort?`| `"dateTimeAsc"`, `"dateTimeDesc"`, `"nameAsc"`, `"nameDesc"` | Specifies the order that sessions should be returned in. If `sort` is omitted or if the provided string does not match one of the possible values, sessions will be returned in ascending order according to the value of their start dateTime (`"dateTimeAsc"`)
|`pageSize?`| 1 ≤ `pageSize` ≤ 50| Specifies the maximum number of sessions to be returned in a single result. For values exceeding the limit of 50, the generator will return up to 50 sessions. If this parameter is omitted, the default `pageSize` of 10 will be used. Any value less than or equal to 1 will retrieve a single session on each call.
|`filters?`| `SessionFilterOptions` | An object describing the criteria by which sessions should be filtered before being returned by this method. See [Using The Session Generator with Filtering](#using-the-session-generator-with-filtering) for more information. If this parameter is omitted, sessions will not be filtered.

| Return Type | Description       |
|-------------|-------------------|
| `AsyncGenerator`| An asynchronous generator function that handles the pagination of requests.  |

The generator yields an object with the following fields:

|  Field Name |Field Type      | Description       |
|-------------|-------------------|----------|
| `sessions`| an array of `SessionDetail` objects| An array of objects that contain properties describing a single session. Will be an empty array `[]` if an error occurs.|
| `totalSessions`| Integer| The total number of sessions that exist in the event. If an error occurs, this value will be `null`. If the filtering option is enabled, this value will also be `null`.|
| `error`| Boolean | Indicates whether an error occurred while retrieving the session data.|

### Using The Session Generator

To trigger a single paginated query for session data, call the `next` method on the generator ([see here](https://javascript.info/async-iterators-generators)). The `value` property on the promised result will contain the `sessions`, `totalSessions` and `error` properties. Once all sessions that exist for the event have been retrieved, the `done` property in all subsequent results will be `true`.

```javascript
// create a generator, omitting parameters to use the defaults
const sessionGenerator = await this.cventSdk.getSessionGenerator();

const page0 =  await sessionGenerator.next(); // returns 10 sessions
// {value:{sessions:[...], totalSessions:17, error: false}, done: false}

const page1 =  await sessionGenerator.next(); // returns 7 sessions
// {value:{sessions:[...], totalSessions:17, error: false}, done: false}

const page2 =  await sessionGenerator.next(); 
// {value: undefined, done: true}
```

### Using The Session Generator with Filtering

When filtering is enabled, each call to the `next` method will return a page of sessions that meet the filtering criteria. A full page of sessions will be returned as long as there are enough available sessions left in the event. The method will return an iterator result with a `done` value of `true` once all available sessions for the registrant have been returned. The `totalSessions` value is not available when filtering is enabled.

#### `SessionFilterOptions`

This object can contain a key for each supported filtering criterion. To enable a filtering criterion, set it's value to true. To ignore a criterion, set it to false or simply omit it. The following filtering criteria are currently supported:

|Criterion Name|Filtering Behavior|
|--------------|------------------|
|`byRegistrationTypeAndAdmissionItem`|Includes only sessions that are configured to be available for the registrant's registration type and admission item. If the registration type has not been selected, the default registration type may be used, depending on how the event registration process has been configured. If an admission item is not selected, no filtering based on admission item will occur.|

Example with filtering:

```javascript
    //retrieve sessions filtered based on the registrant's registration type and admission item
    const sessionGenerator = await this.cventSdk.getSessionGenerator("nameAsc", 20, { byRegistrationTypeAndAdmissionItem: true });

    const page0 =  await sessionGenerator.next(); // returns 20 sessions
    // {value:{sessions:[...], totalSessions: null, error: false}, done: false}

    const page1 =  await sessionGenerator.next(); // returns 11 sessions
    // {value:{sessions:[...], totalSessions: null, error: false}, done: false}

    const page2 =  await sessionGenerator.next(); 
    // {value: undefined, done: true}
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

### Usage Notes

This method supports pagination to improve the performance of the registration site. Fetching all sessions at once may negatively impact site performance.

When filtering by a restrictive set of filtering criteria, using a sufficiently large page size will require fetching every session in the event just to return the first page of available sessions.

---------------------------------------------------------

## `getNavigation()`

Returns an object with methods for controlling navigation. See [Navigation](./sdk/Navigation.md)

## `registration`

For more information on methods defined under the `registration` field of cventSdk, see [Registration](./sdk/Registration.md).