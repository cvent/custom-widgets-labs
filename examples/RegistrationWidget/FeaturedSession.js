const SessionStatus = {
    // registrant has already chosen this session
    SELECTED: 'SELECTED',
    // registrant is on the waitlist for the session
    WAITLISTED: 'WAITLISTED',
    // registrant has not selected this session, but can select it
    OPEN: 'OPEN',
    // registrant has not selected this session, there is no remaining capacity, but there is remaining waitlist capacity
    WAITLIST_AVAILABLE: 'WAITLIST_AVAILABLE',
    // this session is included, either by admission item or session property (distinguished via the `subStatus` returned
    // from getSessionStatus)
    INCLUDED: 'INCLUDED',
    // session is registered already as part of a bundle selection
    BUNDLED: 'BUNDLED',
    // registrant has not selected this session and may not join the waitlist, either because the waitlist is full, or
    // there is no waitlist (distinguished via the `subStatus` returned from getSessionStatus)
    WAITLIST_UNAVAILABLE: 'WAITLIST_UNAVAILABLE',
    // the session is closed or cancelled
    CLOSED: 'CLOSED',
    // this session is not available for the registrant's currently selected admission item or reg typ
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    // no session in this event exists for the provided id
    SESSION_DNE: 'SESSION_DNE',
    // no registration exists (in the current reg cart) for the provided id
    REGISTRATION_DNE: 'REGISTRATION_DNE'
  }
  
  const IncludedSubStatus = {
    // session is included with the chosen admission item
    INCLUDED_BY_ADMISSION_ITEM: 'INCLUDED_BY_ADMISSION_ITEM',
    // session is included by the included/optional property of the session
    INCLUDED_BY_SESSION: 'INCLUDED_BY_SESSION'
  }
  
  const WaitlistSubStatus = {
    // waitlist is not enabled for the session
    NO_WAITLIST: 'NO_WAITLIST',
    // the waitlist is enabled but has no remaining capacity
    WAITLIST_FULL: 'WAITLIST_FULL'
  }
  
  const SessionActionFailureReason = {
    // there was not sufficient capacity to carry out the action, waitlist or session capacity became full
    CAPACITY_ERROR: 'CAPACITY_ERROR',
    // the session was closed, cancelled or otherwise not available
    AVAILABILITY_ERROR: 'AVAILABILITY_ERROR',
    // the error cause could not be determined
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    // the session was in a non actionable status ("CLOSED", "NOT_AVAILABLE", "WAITLIST_UNAVAILABLE", etc.)
    NOT_ACTIONABLE: 'NOT_ACTIONABLE',
    // another registration action was processing when this action was attempted
    REG_ACTION_IN_PROGRESS: 'REG_ACTION_IN_PROGRESS'
  }
  
  export class FeaturedSession extends HTMLDivElement {
    constructor (session, cventSdk, theme, config, imageURL) {
      super()
  
      if (!session) {
        return
      }
  
      this.session = session
      this.theme = theme
      this.config = config
      this.imageURL = imageURL
      this.cventSdk = cventSdk
    }
  
    async connectedCallback () {
      const { name, description, location, startDateTime, endDateTime } = this.session
      const { fontPalette, palette: colorPalette } = this.theme
      const { customColors } = this.config
  
      this.style.width = '32%'
      this.style.margin = '0px 8px 0px 8px'
      this.style.borderRadius = '8px'
      this.style.overflow = 'hidden'
  
      const sessionInfoBlock = document.createElement('div')
      sessionInfoBlock.style.backgroundColor =
      customColors?.background ?? colorPalette.secondary
      sessionInfoBlock.style.height = '100%'
      sessionInfoBlock.style.minWidth = '100%'
  
      // image
      const image = document.createElement('img')
      image.src = this.imageURL
      image.style.width = '100%'
      image.style.height = '184px'
      image.style.objectFit = 'cover'
  
      // session title
      const title = document.createElement('h1')
      title.textContent = name
      title.style.fontFamily = fontPalette.primary
      title.style.color =
      customColors?.textPrimary ?? colorPalette.textAccent
      title.style.margin = '0'
      title.style.padding = '10px 10px 0px 10px'
      title.style.fontSize = '1.5rem'
  
      // session location
      const locationEle = document.createElement('h2')
      locationEle.textContent = location?.name ?? ''
      locationEle.style.fontFamily = fontPalette.secondary
      locationEle.style.color =
      customColors?.textSecondary ?? colorPalette.text
      locationEle.style.margin = '0'
      locationEle.style.padding = '0px 10px 10px 10px'
      locationEle.style.fontSize = '.75rem'
  
      // description text
      const sessionDescription = document.createElement('p')
      sessionDescription.textContent = description
      sessionDescription.style.fontFamily = fontPalette.primary
      sessionDescription.style.color =
      customColors?.textPrimary ?? colorPalette.textAccent
      sessionDescription.style.margin = '0'
      sessionDescription.style.padding = '0px 10px 10px 10px'
      sessionDescription.style.fontSize = '.75rem'
      sessionDescription.style.marginBottom = '100px'
  
      // date range text
      const timeRange = document.createElement('h2')
      const start = new Date(startDateTime)
      const end = new Date(endDateTime)
      const options = { dateStyle: 'medium', timeStyle: 'short' }
      timeRange.textContent = `${start.toLocaleString('en-US', options)} - ${end.toLocaleString('en-US', options)}`
      timeRange.style.fontFamily = fontPalette.secondary
      timeRange.style.color =
      customColors?.textSecondary ?? colorPalette.text
      timeRange.style.margin = '0'
      timeRange.style.padding = '10px 10px 0px 10px'
      timeRange.style.fontSize = '.75rem'
  
      // div containing t
      const regActionElement = await this.buildRegActionElement()
  
      // append all children element to the div
      sessionInfoBlock.append(
        image,
        timeRange,
        title,
        locationEle,
        sessionDescription,
        regActionElement
      )
  
      this.appendChild(sessionInfoBlock)
    }
  
    // create an element that contains text indicating the status of the session and, if the session is in an
    // actionable status, a button that will register/waitlist/unregister/dewaitlist the registrant for the session
    async buildRegActionElement () {
      const { id: sessionId } = this.session
      const { fontPalette, palette: colorPalette } = this.theme
      const { customColors } = this.config
  
      const regActionContainer = document.createElement('div')
      regActionContainer.style.position = 'absolute'
      regActionContainer.style.bottom = '0px'
      regActionContainer.style.height = '72px'
      regActionContainer.style.padding = '10px'
  
      let showRegActionButton = false
      const regActionButton = document.createElement('button')
      regActionButton.style.position = 'absolute'
      regActionButton.onclick = async () => {
        regStatusText.textContent = 'processing...'
        const result = await this.cventSdk.registration.pickSession(sessionId)
  
        if (result.success) {
          // this message could be customized based on the `action` properties of result
          // refresh the status text and button text that are displayed for this featured session
          setRegActionAndStatus()
        } else {
          // this message could be customized based on the `failureReason` and `action` properties of result
          regStatusText.textContent = 'The registration action failed, please refresh and try again'
        }
      }
  
      const regStatusText = document.createElement('p')
      regStatusText.style.fontSize = '.75rem'
  
      // determine the status of the session and update the featured session card text
      // if the status is actionable, set the `showRegActionButton` flag to true and set the button text
      const setRegActionAndStatus = async () => {
        const { status, subStatus } = await this.cventSdk.registration.getSessionStatus(sessionId)
  
        switch (status) {
          case SessionStatus.OPEN: {
            showRegActionButton = true
            regStatusText.textContent = 'This session is available.'
            regActionButton.textContent = 'Register'
            break
          }
          case SessionStatus.WAITLISTED: {
            showRegActionButton = true
            regStatusText.textContent = 'You are on the waitlist for this session.'
            regActionButton.textContent = 'Leave Waitlist'
            break
          }
          case SessionStatus.SELECTED: {
            showRegActionButton = true
            regStatusText.textContent = 'You are registered for this session.'
            regActionButton.textContent = 'Remove'
            break
          }
          case SessionStatus.WAITLIST_AVAILABLE: {
            showRegActionButton = true
            regStatusText.textContent = 'This session is full, but you may join the waitlist.'
            regActionButton.textContent = 'Join the Waitlist'
            break
          }
          case SessionStatus.INCLUDED:{
            if (subStatus === IncludedSubStatus.INCLUDED_BY_SESSION) {
              regStatusText.textContent = 'This session is included automatically.'
            }
            if (subStatus === IncludedSubStatus.INCLUDED_BY_ADMISSION_ITEM) {
              regStatusText.textContent = 'This session is included with your admission item selection.'
            }
            break
          }
          case SessionStatus.BUNDLED:{
            regStatusText.textContent = 'This session is included as part of your bundle selection'
            break
          }
          case SessionStatus.WAITLIST_UNAVAILABLE:{
            if (subStatus === WaitlistSubStatus.NO_WAITLIST) {
              regStatusText.textContent = 'This session is full'
            }
            if (subStatus === WaitlistSubStatus.WAITLIST_FULL) {
              regStatusText.textContent = 'The waitlist for this session is full'
            }
            break
          }
          case SessionStatus.CLOSED:{
            regStatusText.textContent = 'This session is not open for registration'
            break
          }
          case SessionStatus.NOT_AVAILABLE:{
            regStatusText.textContent = 'This session is not available for your chosen registration type and/or admission item'
            break
          }
          // SESSION_DNE, REGISTRATION_DNE
          default:
            regStatusText.textContent = null
            break
        }
      }
  
      await setRegActionAndStatus()
  
      // style our text and button elements
      if (regStatusText) {
        regStatusText.style.fontFamily = fontPalette.primary
        regStatusText.style.color = customColors?.textSecondary ?? colorPalette.text
        regActionContainer.append(regStatusText)
      }
  
      if (showRegActionButton) {
        regActionButton.style.width = '150px'
        regActionButton.style.height = '30px'
        regActionButton.style.fontFamily = fontPalette.primary
        regActionButton.style.color = customColors?.textSecondary ?? colorPalette.text
        regActionButton.style.backgroundColor = customColors?.background ?? colorPalette.secondary
        regActionButton.style.border = `2px solid ${customColors?.textSecondary ?? colorPalette.text}`
        regActionButton.style.borderRadius = '5px'
        regActionButton.style.marginLeft = '155px'
        regActionContainer.append(regActionButton)
      }
      return regActionContainer
    }
  }
  