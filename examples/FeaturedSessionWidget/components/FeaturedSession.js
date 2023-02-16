export class FeaturedSession extends HTMLDivElement {
  constructor(session, theme, config, imageURL) {
    super();

    if (!session) {
      return;
    }

    const { name, description, location, startDateTime, endDateTime , category} = session;

    this.style.width = "32%";
    this.style.margin = "0px 8px 0px 8px";
    this.style.borderRadius = "8px";
    this.style.overflow = "hidden";

    const sessionInfoBlock = document.createElement("div");
    // if a theme override is defined in the configuration, use that instead of the event theme
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
    const locationEle = document.createElement("h2");
    locationEle.textContent = location?.name ?? "";
    locationEle.style.fontFamily = theme.fontPalette.secondary;
    locationEle.style.color =
      config.customColors?.textSecondary ?? theme.palette.text;
    locationEle.style.margin = "0";
    locationEle.style.padding = "0px 10px 10px 10px";
    locationEle.style.fontSize = ".75rem";
    locationEle.style.display = 'inline'

    // description text
    const sessionDescription = document.createElement("p");
    sessionDescription.innerHTML = description;
    sessionDescription.style.fontFamily = theme.fontPalette.primary;
    sessionDescription.style.color =
      config.customColors?.textPrimary ?? theme.palette.textAccent;
    sessionDescription.style.margin = "0";
    sessionDescription.style.padding = "0px 10px 10px 10px";
    sessionDescription.style.fontSize = ".75rem";


    //Session Category
    const sessionCategory = document.createElement("div");
    sessionCategory.style.backgroundColor= `lightgray`;
    sessionCategory.style.fontFamily = theme.fontPalette.secondary;
    sessionCategory.style.color =
      config.customColors?.textSecondary ?? theme.palette.text;
    sessionCategory.style.padding = "2px 4px 2px 4px";
    sessionCategory.style.fontSize = ".75rem";
    sessionCategory.style.display = 'block'

    const sessionCategoryName = document.createElement("p");
    sessionCategoryName.textContent = category.name;
    sessionCategoryName.style.margin = '0px'
    sessionCategoryName.style.display = 'inline'

    const sessionCategoryDescription = document.createElement("div");
    sessionCategoryDescription.innerHTML = category.description;
    sessionCategoryDescription.style.display = 'none'
    sessionCategoryDescription.style.margin = "0px";
    sessionCategoryDescription.style.fontFamily = theme.fontPalette.primary;
    sessionCategoryDescription.style.color =
      config.customColors?.textPrimary ?? theme.palette.textAccent;
    sessionCategoryDescription.style.fontSize = ".75rem";
    

    sessionCategory.onmouseenter = () => {
      sessionCategoryDescription.style.display = "block"
      sessionCategoryDescription.style.margin = "5px";
    }

    sessionCategory.onmouseleave = () => {
      sessionCategoryDescription.style.display = "none"
      sessionCategoryDescription.style.margin = "0px";
    }

    sessionCategory.append(sessionCategoryName, sessionCategoryDescription)


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

    // append all children to the div
    sessionInfoBlock.append(
      image,
      timeRange,
      title,
      locationEle,
      sessionDescription,
      sessionCategory
          );

    this.appendChild(sessionInfoBlock);
  }
}
