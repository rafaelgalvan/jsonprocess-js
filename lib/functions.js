function gerar_codigo_de_obra(tamanho = 10) {
    const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let stringAleatoria = '';

    for (let i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres[Math.floor(Math.random() * caracteres.length)];
    }

    return stringAleatoria;
}

async function send_post_request(url, headers, body) {
    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

async function send_put_request(url, headers, body) {
    let response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

async function send_delete_request(url, headers) {
    let response = await fetch(url, {
        method: 'DELETE',
        headers: headers
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

module.exports = { 
    gerar_codigo_de_obra, 
    send_post_request, 
    send_put_request, 
    send_delete_request 
};