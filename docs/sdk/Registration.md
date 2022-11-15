# Registration

The custom widget SDK provides methods that allow for custom widgets to commit registration actions.

---------------------------------------------------------

## `getSessionStatus`

This method determines the registration status of a session for a particular registrant. The status of a session is determined by several factors:
- The properties of the session configured by the planner
- The remaining capacity of the session or the session's waitlist
- The registrant's product selections

This method does not apply to sessions in a session group.


### Parameters

|Parameters | Possible Values| Description|
|-------------|----------|---------|
|`sessionId`| any string | The id of the session. It is highly recommended that the `id` property of a `SessionDetail` object is used here.|
|`registrationId?`| any string (optional) | An optional parameter that specifies the registration record that the status should be determined for. If omitted, the registration of the current registrant is used.

#### Notes
- The 'current' registrant is the registrant that started the registration process or the primary registrant of a group. It is never a guest registrant.
- As of the first release of the registration portion of the SDK, there is no supported way to retrieve the registrationId of any registrant. As a result, this method is currently limited to use only on the current registrant.

### Returns
This method returns an object with the following properties:

| Property Name| Type | Description       |
|-------------|-------------------|-|
|`status`| String | The primary status of the session |
|`subStatus?`| String | The secondary status of the session which provides additional context to the primary status. This value is only returned alongside the following primary statuses: `"WAITLIST_UNAVAILABLE"` and `"INCLUDED"`.|

Possible return values are limited to the following:
|Value|Description|
|-------------|----------|
|  `{status: "SELECTED"}` |   registrant has selected this item |
|  `{status: "WAITLISTED"}` | registrant is on the waitlist for this session | 
|  `{status: "OPEN"}` |   registrant is not registered for this session, but may register | 
|  `{status: "WAITLIST_AVAILABLE"}` | the session has reached capacity, but the registrant may join the waitlist|
|  `{status: "INCLUDED", subStatus:"INCLUDED_BY_ADMISSION_ITEM"}` | the session is included automatically due to the registrant's admission item selection| 
|  `{status: "INCLUDED", subStatus:"INCLUDED_BY_SESSION"}` | this session is an included, non-optional session, and is included automatically for every registrant| 
|  `{status: "BUNDLED"}` | this session is included already by the registrant's bundle selection| 
|  `{status: "CLOSED"}` | this session is closed for several possible reasons: <li> the session was cancelled by the planner  <li> the session's "Automatically closes on" date has passed <li> the session's "Allow registration" property is set to "No"| 
|  `{status: "NOT_AVAILABLE"}` | this session is not available to the registrant because their admission item or registration type excludes it| 
|  `{status: "WAITLIST_UNAVAILABLE", subStatus: "NO_WAITLIST"}` | the session is at capacity and does not have a waitlist| 
|  `{status: "WAITLIST_UNAVAILABLE", subStatus: "WAITLIST_FULL"}` | the session and the waitlist for the session are at capacity| 
|  `{status: "SESSION_DNE"}` | no session exists with the id provided to the `sessionId` parameter.| 
|  `{status: "REGISTRATION_DNE"}` | no registration exists with the id provided to the `registrationId` parameter. This can occur if this method is called before a registration ahs been started.| 

### Using `getSessionStatus`

```javascript
const sessionGenerator = await this.cventSdk.getSessionGenerator('dateTimeDesc', 20);

// retrieve the first page of sessions
const { sessions } = await sessionGenerator.next();

// get the session status of the first session
const { status, subStatus } = await this.cventSdk.registration.getSessionStatus(sessions[0].id);
```
note: a more robust example is available [here](../../examples/RegistrationWidget/README.md)

### Usage Notes
- This method should be used in conjunction with `getSessionGenerator` to prevent the possibility of passing invalid values to the `sessionId` parameter.
---------------------------------------------------------

## `pickSession`
This method commits a registration action for a session, if possible. The possible registration actions are:
- registering a user for a session
- deregistering a user for a session
- adding a user to the waitlist for a session
- removing a user from the waitlist for a session

Which registration is taken depends on the status of the session, which is determined by the same algorithm as `getSessionStatus`.


### Parameters
|Parameters | Possible Values| Description|
|-------------|----------|---------|
|`sessionId`| any string | The id of the session. It is highly recommended that the `id` property of a `SessionDetail` object is used here.|
|`registrationId?`| any string (optional) | An optional parameter that specifies the registration record that the registration action should be taken for. If omitted, the registration of current registrant is used.

#### Notes
- The 'current' registrant is the registrant that started the registration process or the primary registrant of a group. It is never a guest registrant.
- As of the first release of the registration portion of the SDK, there is no supported way to retrieve the registrationId of any registrant. As a result, this method is currently limited to use only on the current registrant.


### Returns
This method returns an object with the following properties:

| Property Name| Type | Description|
|-------------|-------------------|-------|
|`initialStatus`| `{status: string, subStatus?:string}` |The status of the session, as determined by `getSessionStatus`, before the registration action was attempted |
|`action`| one of the following strings: <li> `'REGISTER'`  <li> `'UNREGISTER'`  <li>`'WAITLIST'`  <li> `'LEAVE_WAITLIST'`<br> or `null` if no action was attempted | A string describing the registration action that was attempted. If the session status is non-actionable, and no action was taken, this property will be `null`.|
|`success`| `true` / `false`| Boolean value indicating the success/failure of the attempted registration action|
|`failureReason`| one of the following strings: <li>`'CAPACITY_ERROR'`<li>`'AVAILABILITY_ERROR'`<li>`'UNKNOWN_ERROR'`<li>`'NOT_ACTIONABLE'`<li>`'REG_ACTION_IN_PROGRESS'` <br> or `undefined` if the action was successful | String value describing why the registration action failed |

The value of these properties depends on the status of the session at the time that `pickSession` is called and the ultimate success or failure of the action.


### Actionable Session Statuses
`pickSession` will only attempt a to commit a registration action for sessions that have an "actionable" status. The actionable statuses are limited to the ones listed below in the `initialStatus` column. This table also shows the corresponding `action` that will be attempted for each actionable session status.

|`initialStatus`|`action`|Status after a successful action
|-------------|----------|-|
|  `SELECTED` |  `'UNREGISTER'`| `OPEN` |
|  `WAITLISTED` | `'LEAVE_WAITLIST'` |  `WAITLIST_AVAILABLE`|
|  `OPEN` |   `'REGISTER'` |   `SELECTED`|
|  `WAITLIST_AVAILABLE` | `'WAITLIST'`| `WAITLISTED`|

### Non-Actionable Session Statuses
The remaining statuses:
- `INCLUDED`
- `BUNDLED`
- `CLOSED`
- `NOT_AVAILABLE`
- `WAITLIST_UNAVAILABLE`
- `WAITLIST_UNAVAILABLE`
- `SESSION_DNE`
- `REGISTRATION_DNE`

are non-actionable. No registration action will be attempted and the session status will be unaffected by the pickSession call. A call to `pickSession` for a session with one of these non-actionable statuses will always return a failure result.

### Possible Failure Reasons
When a call to `pickSession` fails, in addition to returning a `success` value of `false`, a `failureReason` field will be included in the response object.

|`failureReason`|Description|
|--|--|
|`'CAPACITY_ERROR'`| The session capacity or waitlist capacity is full. This can occur if the capacity becomes full after the registrant begins their registration.||
|`'AVAILABILITY_ERROR'`|The session is no longer available. This can occur if the session is cancelled or closed after the registrant begins their registration.|
|`'UNKNOWN_ERROR'`| The cause of the failure could not be determined. If this error, persists, reach out to Cvent support.|
|`'NOT_ACTIONABLE'`| The session was in a non-actionable status when the method was called|
|`'REG_ACTION_IN_PROGRESS'`| A registration action originating from outside of the custom widgetSDK was processing when `pickSession` was called.|


### Using `pickSession`

```javascript
const sessionGenerator = await this.getSessionGenerator('dateTimeDesc', 20);

// retrieve the first page of sessions
const {sessions} = sessionGenerator.next();

// get the session status of the first session
const { status, subStatus } = await this.cventSdk.registration.getSessionStatus(sessions[0].id);

switch (status) {
    // attempt a registration action only if the session is in a non actionable status
    case "OPEN":
    case "WAITLISTED":
    case "SELECTED":
    case "WAITLIST_AVAILABLE":{
        const { success, action, failureReason, initialStatus } = await this.cventSdk.registration.pickSession(sessionId);

        console.log(`a ${action} action was attempted for the session with id ${sessionId}`);
        
        if (!success) {
            console.log(`the ${action} action attempted for the session with id: ${sessionId} failed with error code: ${failureReason}. The session remains in the status: ${initialStatus}`);
        }
        break;
    }
    default:
        console.log(`no action can be taken for a session with the status ${status}`)
}
```
note: a more robust example is available [here](../../examples/RegistrationWidget/README.md)

### Usage Notes
- Committing a registration action requires a network call and usually takes a few seconds to process. If `pickSession` is called while another `pickSession` action is processing, both calls will return the same result if they share the same parameters. If they do not share parameters, the calls will be executed one at a time, in the order that they are made. This means that a double click will likely not cause an action to be done and undone in rapid succession.
- This method should be used in conjunction with `getSessionGenerator` to prevent the possibility of passing invalid values to the `sessionId` parameter.