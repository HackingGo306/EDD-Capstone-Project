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

const petDictionary = {
  egg: ["/Egg Pet/Egg 1.png", "/Egg Pet/Egg 3.png"],
  cat: ["", "/Cat Pet/Cat 1.png", "/Cat Pet/Cat 2.png", "/Cat Pet/Cat 3.png", "/Cat Pet/Cat 4.png"],
};

export { requestHandler, petDictionary };