const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");

router.get("/", incidentController.getIncidents);
router.post("/", incidentController.createIncident);
router.patch("/:id/state", incidentController.updateState);
router.get("/:id/notes", incidentController.getNotes);
router.post("/:id/notes", incidentController.addNote);

module.exports = router;
