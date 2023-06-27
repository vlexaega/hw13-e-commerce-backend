const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", (req, res) => {
  // create a new tag
  const newTagData = req.body;

  Tag.create(newTagData)
    .then((tag) => {
      res.status(201).json(tag);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Failed to create new Tag" });
    });
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  const tagId = req.params.id;
  const updatedTagName = req.body.tag_name;

  try {
    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      return res.status(404).json({ error: "Tag is not found" });
    }
    tag.tag_name = updatedTagName;
    const updatedTag = await tag.save();
    res.json(updatedTag);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update Tag" });
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
