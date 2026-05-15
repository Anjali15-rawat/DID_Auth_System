const incidentRepository = require("../repositories/incidentRepository");
const eventBus = require("../eventBus");

exports.getIncidents = async (req, res) => {
  try {
    const incidents = await incidentRepository.getIncidents();
    res.json({ data: incidents });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
};

exports.createIncident = async (req, res) => {
  try {
    const { title, severity } = req.body;
    const incident = await incidentRepository.createIncident(title, severity);
    eventBus.emit("incident-events", { type: "created", incident });
    res.json({ data: incident });
  } catch (error) {
    res.status(500).json({ error: "Failed to create incident" });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const incident = await incidentRepository.updateIncidentState(id, state);
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    
    eventBus.emit("incident-events", { type: "updated", incident });
    res.json({ data: incident });
  } catch (error) {
    res.status(500).json({ error: "Failed to update incident" });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { analyst_id, notes } = req.body;
    const note = await incidentRepository.addInvestigationNote(id, analyst_id, notes);
    
    eventBus.emit("incident-events", { type: "note_added", incident_id: id, note });
    res.json({ data: note });
  } catch (error) {
    res.status(500).json({ error: "Failed to add note" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await incidentRepository.getNotes(id);
    res.json({ data: notes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};
