/**
 * Recupera o endpoint do objeto. Alguns objetos possuem o atributo 'type' igual (ex.: Seccionamento).
 * Nesses casos precisamos olhar para o atributo featureType dele e então capturar o endpoint com base nesse valor.
 * @param {object} objeto Objeto que será processado
 * @param {object} endpoints Lista com os endpoints
 * @returns {string} endpoint do objeto
 */
function get_object_endpoint(objeto, endpoints) {
    let endpoint = endpoints[objeto.type];
    if (typeof endpoint === 'object' && endpoint !== null) {
        let ftype = objeto.spatial.featureType;
        if (ftype === undefined) {
            throw new Error("Atributo featureType do objeto nao encontrado.");
        }
        return endpoint[ftype];
        
    }
    return endpoint;
}

/**
 * Envia requisicao POST para o endpoint do objeto
 * @param {string} url url 
 * @param {object} headers headers
 * @param {object} body corpo 
 * @returns {object} resposta da requisicao
 */
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

/**
 * Envia requisicao PUT para o endpoint do objeto
 * @param {string} url url 
 * @param {object} headers headers
 * @param {object} body corpo 
 * @returns {object} resposta da requisicao
 */
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

/**
 * Envia requisicao DELETE para o endpoint do objeto
 * @param {string} url url 
 * @param {object} headers headers
 * @returns {object} resposta da requisicao
 */
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

/**
 * Envia requisicao POST para o endpoint '/obra/commit' 
 * @param {string} url url 
 * @param {object} headers headers
 * @param {object} body corpo 
 * @returns {object} resposta da requisicao
 */
async function send_commit_request(url, headers, body) {
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

module.exports = { 
    get_object_endpoint,
    send_post_request, 
    send_put_request, 
    send_delete_request,
    send_commit_request
};