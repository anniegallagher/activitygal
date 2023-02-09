import express from "express";
import db from "../models";
import uploadParser from "../upload";

import fs from "fs/promises";
import path from "path";

const fsRoot = process.env.PERSISTENT_STORAGE ?? "/tmp";

const adminRouter = express.Router();

adminRouter.get("/", async function (req, res, next) {
  console.log("admin root", req.auth);
  const allGalleries = await db.Gallery.findAll({
    attributes: ["id", "slug"],
  });
  const allPages = await db.Page.findAll({ attributes: ["id", "slug"] });
  const pageData = {
    title: "auth: " + req.auth.user,
    // TODO: is this map necessary?
    galleries: allGalleries.map((g) => g.dataValues),
    pages: allPages.map((p) => p.dataValues),
  };
  res.render("admin", pageData);
});

// TODO: multiple galleries/containers per photo? here or elsewhere?
adminRouter.post(
  "/photo",
  uploadParser.array("photos"),
  async function (req, res, next) {
    const [photos, targetId] = [req.files, req.body.target];
    const toTarget = await db.Gallery.findOne({
      where: { id: targetId },
    });
    // TODO: data per photo
    res.json(
      await Promise.all(
        photos.map((photo) =>
          fs
            .rename(photo.path, path.join(fsRoot, "photo", photo.filename))
            .then(() =>
              toTarget.createPhoto({
                type: photo.mimetype,
                resource: photo.filename,
                originalname: photo.originalname,
              })
            )
        )
      )
    );
  }
);

// TODO: paginate
adminRouter.get("/gallery", (req, res) => {
  db.Gallery.findAll().then((allGalleries) => res.json(allGalleries));
});
adminRouter.get("/page", (req, res) => {
  db.Page.findAll().then((allPages) => res.json(allPages));
});
adminRouter.get("/photo", (req, res) => {
  db.Photo.findAll().then((allPhotos) => res.json(allPhotos));
});

adminRouter.post(
  "/gallery",
  express.urlencoded({ extended: true /* shut up deprecated */ }),
  async function (req, res, next) {
    console.log("gallery post");
    const galleryId = req.body?.galleryId;
    const galleryForm = {
      title: req.body?.title,
      description: req.body?.description,
      PageId: req.body?.PageId,
    };
    if (galleryId) {
      const galleryToUpdate = await db.Gallery.findOne({
        where: { id: galleryId },
      });
      const galleryUpdated = await galleryToUpdate.update(galleryForm);
      res.json(galleryUpdated);
    } else {
      const galleryCreated = await db.Gallery.create(galleryForm);
      res.json(galleryCreated);
    }
  }
);

adminRouter.post(
  "/page",
  express.urlencoded({ extended: true /* shut up deprecated */ }),
  async function (req, res, next) {
    console.log("page post");
    const pageId = req.body?.PageId;
    const pageForm = {
      title: req.body?.title,
      description: req.body?.description,
    };
    if (pageId) {
      const pageToUpdate = await db.Page.findOne({
        where: { id: pageId },
      });
      const pageUpdated = await pageToUpdate.update(pageForm);
      res.json(pageUpdated);
    } else {
      const pageCreated = await db.Page.create(pageForm);
      res.json(pageCreated);
    }
  }
);

export default adminRouter;
