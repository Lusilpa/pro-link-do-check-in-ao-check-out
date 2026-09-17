var API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://localhost:8080';

async function getPostById(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao buscar post`);
    }
    const json = await response.json();
    return json.data;
}

async function updatePost(id, data) {
    return apiRequest(`/posts/edit/${id}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao salvar post`);
    }

    return response.json();
}