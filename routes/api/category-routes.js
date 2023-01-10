const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: Product,
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: Product,
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category was found with this id!" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const checkCategoryId = await Category.findByPk(req.params.id);
    if (!checkCategoryId) {
      res.status(400).json({ message: "There is no category with that ID!" });
      return;
    }
    await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const updatedCategoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    res.status(200).json(updatedCategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const checkCategoryId = await Category.findByPk(req.params.id);
    if (!checkCategoryId) {
      res.status(400).json({ message: "There is no category with that ID!" });
      return;
    }
    Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    const deletedCategoryId = await Category.findByPk(req.params.id);
    if (!deletedCategoryId) {
      res
        .status(200)
        .json({ message: "The category has been successfully deleted!" });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
