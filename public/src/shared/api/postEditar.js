var API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://localhost:8080';

async function getUserPosts() {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao buscar posts`);
    }
    const json = await response.json();
    return json.data;
}

async function updatePost(id, data) {
    const response = await fetch(`${API_BASE_URL}/posts/edit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao salvar post`);
    }

    return response.json();
}