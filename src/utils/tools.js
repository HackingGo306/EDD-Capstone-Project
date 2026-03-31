async function requestHandler(request) {
  //no catching when request is get to trigger react query error
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error.config.method === "get") {
      //throw error;
    }

    if (error.response) {
      return error.response.data;
    }
    return { success: false };
  }
}

// const petDictionary = {
//   egg: ["/Egg Pet/Egg 1.png", "/Egg Pet/Egg 2.png", "/Egg Pet/Egg 3.png"],
//   cat: ["", "/Cat Pet/Cat 1.png", "/Cat Pet/Cat 2.png", "/Cat Pet/Cat 3.png", "/Cat Pet/Cat 4.png"],
//   dog: ["", "/Dog Pet/Dog 1.png", "/Dog Pet/Dog 2.png", "/Dog Pet/Dog 3.png", "/Dog Pet/Dog 4.png"],
//   fly: ["", "/Fly Pet/Fly 1.png", "/Fly Pet/Fly 2.png", "/Fly Pet/Fly 3.png", "/Fly Pet/Fly 4.png"],
//   emoji: ["", "/Emoji Pet/Smirk Emoji.png"],
// };

const petImg = (type, level, xp) => {
  if (type === "egg") {
    if (xp >= 5) {
      return `/Egg Pet/Egg 2.gif`;
    }
    return `/Egg Pet/Egg ${level}.gif`;
  } else if (type === "cat") {
    return `/Cat Pet/Cat ${level}.gif`;
  } else if (type === "dog") {
    return `/Dog Pet/Dog ${level}.gif`;
    } else if (type === "fly") {
      return `/Fly Pet/Fly ${level}.gif`;
    } else if (type === "emoji") {
    return `/Emoji Pet/Smirk Emoji.gif`;
  }
}
export { requestHandler , petImg};