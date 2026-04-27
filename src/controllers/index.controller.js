const INTERNAL_ERROR_MSG = "Internal Server Error";

const indexController = {};

indexController.homePage = async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    res.status(500).json({ message: INTERNAL_ERROR_MSG, error: error.message });
  }
};

export { indexController };
