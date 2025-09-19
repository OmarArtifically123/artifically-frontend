import api from "../api";

export async function fetchAutomations() {
  const res = await api.get("/marketplace");
  return res.data.automations;
}
