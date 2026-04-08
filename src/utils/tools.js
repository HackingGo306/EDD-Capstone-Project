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

const petImg = (type, level, xp) => {
  if (type === "egg") {
    if (xp >= 5 && level == 0) {
      return `/Egg Pet/Egg cracked.png`;
    }
    return `/Egg Pet/Egg ${level}.png`;
  } else if (type === "cat") {
    return `/Cat Pet/Cat ${level}.png`;
  } else if (type === "dog") {
    return `/Dog Pet/Dog ${level}.png`;
    } else if (type === "fly") {
      return `/Fly Pet/Fly ${level}.png`;
    } else if (type === "emoji") {
    return `/Emoji Pet/Smirk Emoji.gif`;
  }
}
export { requestHandler , petImg};