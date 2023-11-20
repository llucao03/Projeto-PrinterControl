const KEY_BD = '@printercontrol'

var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}


var FILTRO = ''

function gravarBD(){
        localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(){
    FILTRO = value;
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.fone ) || expReg.test( usuario.id )
            } )
        }
        data = data
        .sort( (a, b) => {
            return a.nome < b.nome ? -1 : 1
        })
        .map( usuario => {
            return `<tr>
                   <td>${usuario.id}</td>
                   <td>${usuario.nome}</td>
                   <td>${usuario.fone}</td>
                   <td>${usuario.marca}</td>
                   <td>${usuario.modelo}</td>
                   <td>${usuario.nrSerie}</td>
                   <td>${usuario.defeito}</td>
                   <td>${usuario.statusDI}</td>
                   <td>
                   <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                   <button class='vermelho'onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                   </td>
                </tr>`
        } )
        tbody.innerHTML = data.join('')  
    }
}

function insertUsuario(nome, fone, marca, modelo, nrSerie, defeito, statusDI){
    const id = listaRegistros.ultimoIdGerado +1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, fone,  marca, modelo, nrSerie, defeito, statusDI
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, fone, marca, modelo, nrSerie, defeito, statusDI){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.fone = fone;
    usuario.marca = marca;
    usuario.modelo = modelo;
    usuario.nrSerie = nrSerie;
    usuario.defeito = defeito;
    usuario.statusDI = statusDI;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro da OS'+id))
    deleteUsuario(id)
}

function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('fone').value = ''
    document.getElementById('marca').value = ''
    document.getElementById('modelo').value = ''
    document.getElementById('nrSerie').value = ''
    document.getElementById('defeito').value = ''
    document.getElementById('statusDI').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id === id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('fone').value = usuario.fone
                document.getElementById('marca').value = usuario.marca
                document.getElementById('modelo').value = usuario.modelo
                document.getElementById('nrSerie').value = usuario.nrSerie
                document.getElementById('defeito').value = usuario.defeito
                document.getElementById('statusDI').value = usuario.statusDI
            }
        }
        document.getElementById('nome').focus()
    }
}


function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        fone: document.getElementById('fone').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        nrSerie: document.getElementById('nrSerie').value,
        defeito: document.getElementById('defeito').value,
        statusDI: document.getElementById('statusDI').value,
    }
    if(data.id){
        editUsuario(data.id, data.nome, data.fone, data.marca, data.modelo, data.nrSerie, data.defeito, data.statusDI)
    }else{
        insertUsuario( data.nome, data.fone, data.marca, data.modelo, data.nrSerie, data.defeito, data.statusDI)
    }
}

window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro') .addEventListener('submit', submeter)
    document.getElementById('inputPesquisa') .addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })
})