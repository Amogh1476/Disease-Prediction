const API_BASE_URL = "http://localhost:8000";

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    if (!res.ok) throw new Error("API not responding");
    return await res.json();
  } catch (error) {
    console.error("Health check error:", error);
    return { error: error.message };
  }
}

export async function fetchAllSymptoms() {
  try {
    const res = await fetch(`${API_BASE_URL}/symptoms`);
    if (!res.ok) throw new Error("Failed to load symptoms list");
    return await res.json();
  } catch (error) {
    console.error("Fetch symptoms error:", error);
    throw error;
  }
}

export async function predictDisease(text, selectedSymptoms) {
  try {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text || "",
        selected_symptoms: selectedSymptoms || [],
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to make disease prediction");
    }

    return await res.json();
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}
