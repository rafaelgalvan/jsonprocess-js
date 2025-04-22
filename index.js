const config =  require('./config/config.json');
const endpoints = require('./config/endpoints.json');
const atividade = require('./data/atividade.json');
const {
    get_object_endpoint,
    add_endpoint_specific_treatment,
    send_post_request, 
    send_put_request, 
    send_delete_request,
    send_commit_request
} = require('./lib/functions.js');

// verifica se o parâmetro commit foi enviado na chamada
const commit = process.argv[2];

// identificador do conjunto de objetos que fazem parte da atividade
const codigoDaObra = atividade.idAtividade;

function getHeaders() {
    return new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(config.user + ":" + config.password)
    });
}

/**
 * Envia o commit da atividade
 */
async function enviarCommit() {
    let url = config.url + 'obra/commit';
    let objeto = {"codigoDaObra": codigoDaObra};
    console.log(`Enviando Commit da obra ${codigoDaObra}`);
    let response = await send_commit_request(url, getHeaders(), objeto);
    console.log(`Commit enviado. Resposta: ${response.status}: ${response.statusText}`);
}

/**
 * Envia para o servidor os objetos que serao inseridos
 * @param {Array} objetos Array com os objetos
 */
async function inserirObjetos(objetos) {
    for (const objeto of objetos) {
        objeto.codigoDaObra = codigoDaObra;
        let endpoint = get_object_endpoint(objeto, endpoints);
        let url = config.url + endpoint;

        let response = await send_post_request(url, getHeaders(), objeto);
        console.log(`Objeto: ${objeto.type}, ID: ${objeto.id}, resposta: ${response.status}: ${response.statusText}`);
    }
}

/**
 * Envia para o servidor os objetos que serao alterados
 * @param {Array} objetos Array com os objetos
 */
async function alterarObjetos(objetos) {
    for (const objeto of objetos) {
        objeto.codigoDaObra = codigoDaObra;
        let endpoint = get_object_endpoint(objeto, endpoints);
        endpoint = add_endpoint_specific_treatment(endpoint, objeto.type);

        let url = `${config.url}${endpoint}/${objeto.id}`;

        let response = await send_put_request(url, getHeaders(), objeto);
        console.log(`Objeto: ${objeto.type}, ID: ${objeto.id}, resposta: ${response.status}: ${response.statusText}`);
    }
}

/**
 * Envia para o servidor os objetos que serao removidos
 * @param {Array} objetos Array com os objetos
 */
async function removerObjetos(objetos) {
    let headers = getHeaders();
    headers.delete('Content-Type');

    for (const objeto of objetos) {
        objeto.codigoDaObra = codigoDaObra;
        let endpoint = get_object_endpoint(objeto, endpoints);
        endpoint = add_endpoint_specific_treatment(endpoint, objeto.type);
        let url = `${config.url}${endpoint}/${codigoDaObra}/${objeto.id}`;
        let response = await send_delete_request(url, headers);
        console.log(`Objeto: ${objeto.type}, ID: ${objeto.id}, resposta: ${response.status}: ${response.statusText}`);
    }
}
/**
 * Processamento dos objetos
 */
async function processarObjetos() {
    console.log("::: Atividade - id: " + codigoDaObra + " :::");
    if (atividade.entidadesCadastradas !== undefined && atividade.entidadesCadastradas.length > 0) {
        console.log("::: Represando objetos inseridos :::")
        console.log();
        await inserirObjetos(atividade.entidadesCadastradas);
        console.log();
    }
    
    if (atividade.entidadesAlteradas !== undefined && atividade.entidadesAlteradas.length > 0) {
        console.log("::: Represando objetos alterados :::");
        console.log();
        await alterarObjetos(atividade.entidadesAlteradas);
        console.log();
    }
    
    if (atividade.entidadesExcluidas !== undefined && atividade.entidadesExcluidas.length > 0) {
        console.log("::: Represando objetos removidos :::");
        console.log();
        await removerObjetos(atividade.entidadesExcluidas);
        console.log();
    }
}

if (commit !== undefined && (commit === "commit" || commit === '-c')) {
    enviarCommit();
} else {
    processarObjetos();
}
