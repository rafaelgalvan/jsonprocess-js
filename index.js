const config =  require('./config/config.json');
const endpoints = require('./config/endpoints.json');
const atividade = require('./data/atividade.json');
const { 
    gerar_codigo_de_obra, 
    send_post_request, 
    send_put_request, 
    send_delete_request 
} = require('./lib/functions.js');

const codigoDaObra = gerar_codigo_de_obra();

function getHeaders() {
    return new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(config.user + ":" + config.password)
    });
}

async function inserirObjetos(objetos) {
    for (const objeto of objetos) {
        objeto.codigoDaObra = codigoDaObra;
        let url = config.url + endpoints[objeto.type];

        let response = await send_post_request(url, getHeaders(), objeto);
        console.log(`Objeto: ${objeto.type}, ID: ${objeto.id}, resposta: ${response.status}: ${response.statusText}`);
    }
}

async function alterarObjetos(objetos) {
    for (const objeto of objetos) {
        objeto.codigoDaObra = codigoDaObra;
        let url = `${config.url}${endpoints[objeto.type]}/${objeto.id}`

        let response = await send_put_request(url, getHeaders(), objeto);
        console.log(`Objeto: ${objeto.type}, ID: ${objeto.id}, resposta: ${response.status}: ${response.statusText}`);
    }
}

async function removerObjetos(objetos) {
    let headers = getHeaders();
    headers.delete('Content-Type');

    for (const objeto of objetos) {
        objeto.codigoDaObra = codigoDaObra;
        let url = `${config.url}${endpoints[objeto.type]}/${codigoDaObra}/${objeto.id}`;
        let response = await send_delete_request(url, headers);
        console.log(`Objeto: ${objeto.type}, ID: ${objeto.id}, resposta: ${response.status}: ${response.statusText}`);
    }
}

async function processarObjetos() {
    if (atividade.entidadesCadastradas !== undefined && atividade.entidadesCadastradas.length > 0) {
        console.log("::: Objetos Inseridos :::")
        console.log();
        await inserirObjetos(atividade.entidadesCadastradas);
        console.log();
    }
    
    if (atividade.entidadesAlteradas !== undefined && atividade.entidadesAlteradas.length > 0) {
        console.log("::: Objetos Alterados :::");
        console.log();
        await alterarObjetos(atividade.entidadesAlteradas);
        console.log();
    }
    
    if (atividade.entidadesExcluidas !== undefined && atividade.entidadesExcluidas.length > 0) {
        console.log("::: Objetos Removidos :::");
        console.log();
        await removerObjetos(atividade.entidadesExcluidas);
        console.log();
    }
}

processarObjetos();