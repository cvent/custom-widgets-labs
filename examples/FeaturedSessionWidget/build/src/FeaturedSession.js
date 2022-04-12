export class FeaturedSession extends HTMLDivElement {
  constructor(session, theme, config, imageURL) {
    super();

    if (!session) {
      return;
    }

    const {
      name,
      description,
      location: { name: locationName },
      startDateTime,
      endDateTime,
    } = session;

    this.style.width = "32%";
    this.style.margin = "0px 8px 0px 8px";
    this.style.borderRadius = "8px";
    this.style.overflow = "hidden";

    const sessionInfoBlock = document.createElement("div");
    sessionInfoBlock.style.backgroundColor =
      config.customColors?.background ?? theme.palette.secondary;
    sessionInfoBlock.style.height = "100%";
    sessionInfoBlock.style.minWidth = "100%";

    // image
    const image = document.createElement("img");
    image.src = imageURL;
    image.style.width = "100%";
    image.style.height = "184px";
    image.style.objectFit = "cover";

    // session title
    const title = document.createElement("h1");
    title.textContent = name;
    title.style.fontFamily = theme.fontPalette.primary;
    title.style.color =
      config.customColors?.textPrimary ?? theme.palette.textAccent;
    title.style.margin = "0";
    title.style.padding = "10px 10px 0px 10px";
    title.style.fontSize = "1.5rem";

    // session location
    const location = document.createElement("h2");
    location.textContent = locationName;
    location.style.fontFamily = theme.fontPalette.secondary;
    location.style.color =
      config.customColors?.textSecondary ?? theme.palette.text;
    location.style.margin = "0";
    location.style.padding = "0px 10px 10px 10px";
    location.style.fontSize = ".75rem";

    // description text
    const sessionDescription = document.createElement("p");
    sessionDescription.textContent = description;
    sessionDescription.style.fontFamily = theme.fontPalette.primary;
    sessionDescription.style.color =
      config.customColors?.textPrimary ?? theme.palette.textAccent;
    sessionDescription.style.margin = "0";
    sessionDescription.style.padding = "0px 10px 10px 10px";
    sessionDescription.style.fontSize = ".75rem";

    // date range text
    const timeRange = document.createElement("h2");
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const options = { dateStyle: "medium", timeStyle: "short" };

    timeRange.textContent = `${start.toLocaleString(
      "en-US",
      options
    )} - ${end.toLocaleString("en-US", options)}`;

    timeRange.style.fontFamily = theme.fontPalette.secondary;
    timeRange.style.color =
      config.customColors?.textSecondary ?? theme.palette.text;
    timeRange.style.margin = "0";
    timeRange.style.padding = "10px 10px 0px 10px";
    timeRange.style.fontSize = ".75rem";

    // append all children element to the div
    sessionInfoBlock.append(
      image,
      timeRange,
      title,
      location,
      sessionDescription
    );

    this.appendChild(sessionInfoBlock);
  }
}
