// ==========================================
// API SERVICE: Feed e Publicações
// ==========================================

const FEED_API_URL = "http://localhost:8080/api/feed"; // Ajuste para a URL real

/**
 * Busca as publicações do feed no back-end.
 * @returns {Promise<Array>} Lista de posts ou array vazio em caso de erro.
 */
async function fetchFeedPosts() {
  try {
    const token = localStorage.getItem("prolink_token");
    const response = await fetch(`${FEED_API_URL}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar as publicações.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na API do Feed:", error);
    return [];
  }
}