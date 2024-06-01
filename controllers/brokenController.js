const buildBroken = async (req, res, next) => {
  try {
    const promise = new Promise((resolve, reject) => {
      reject(
        new Error(
          "this route is broken (but this is a sensitive error message)."
        )
      );
    });
    const myResult = await promise;
    res.send(myResult);
  } catch (e) {
    return next({
      status: 500,
      message: e.message,
    });
  }
};

export default { buildBroken };
