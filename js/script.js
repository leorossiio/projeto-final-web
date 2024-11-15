// Função para carregar o header
fetch('../components/header/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o header:', error));

fetch('../components/footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o footer:', error));


$(document).ready(function () {
    $("#header").load("../components/header/header.html");
    $("#footer").load("../components/footer/footer.html");
});

//produtos
document.addEventListener("DOMContentLoaded", function () {
    let produtos = [];

    fetch('../assets/data/produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data;
            renderizarProdutos(produtos);
        })
        .catch(error => {
            console.error("Erro ao carregar os produtos:", error);
        });

    // Função para renderizar produtos
    function renderizarProdutos(produtos) {
        const gridProdutos = document.querySelector('.grid-produtos');
        gridProdutos.innerHTML = '';

        if (produtos.length === 0) {
            gridProdutos.innerHTML = '<p style="font-weight: bold">Nenhum produto encontrado.</p>';
            return;
        }

        produtos.forEach(produto => {
            const produtoCard = `
                <div class="card produto-card">
                  <img src="/assets/imagens/produtos/${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                  <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.marca}</p>
                    <p class="card-text">${produto.descricao}</p>
                    <p class="card-preco">R$ ${produto.preco.toFixed(2)}</p>
                    <button class="adicionar-carrinho"><i class="fas fa-shopping-cart"></i></button>
                  </div>
                </div>
            `;
            gridProdutos.innerHTML += produtoCard;
        });
    }

    document.getElementById('filtrar-btn').addEventListener('click', function () {
        const nome = document.getElementById('filtro-nome').value.toLowerCase();
        const marca = document.getElementById('filtro-marca').value.toLowerCase();
        const precoMaximo = parseFloat(document.getElementById('filtro-preco').value) || Infinity;

        const produtosFiltrados = produtos.filter(produto => {
            return (
                produto.nome.toLowerCase().includes(nome) &&
                produto.marca.toLowerCase().includes(marca) &&
                produto.preco <= precoMaximo
            );
        });

        renderizarProdutos(produtosFiltrados);
    });

});

// Função para carregar os estados e preencher o select
function carregarEstados() {
    fetch('../assets/data/estados.json')
        .then(response => response.json())
        .then(estados => {
            const selectEstado = document.getElementById('estado');

            // Limpa as opções existentes
            selectEstado.innerHTML = '<option value="" disabled selected>Selecione o estado</option>';

            // Adiciona as opções no select
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                selectEstado.appendChild(option);
            });
        })
        .catch(erro => console.log('Erro ao carregar estados:', erro));
}

// Chama a função para carregar os estados quando a página carregar
document.addEventListener('DOMContentLoaded', carregarEstados);


// Endereço
function buscarEndereco(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(dados => {
            if (dados.erro) {
                console.log('CEP não encontrado');
            } else {
                // Preencher os campos do formulário com os dados recebidos da API
                document.getElementById('logradouro').value = dados.logradouro || '';
                document.getElementById('bairro').value = dados.bairro || '';
                document.getElementById('cidade').value = dados.localidade || '';
                document.getElementById('estado').value = dados.uf || '';
                document.getElementById('cep').value = dados.cep || '';
            }
        })
        .catch(erro => console.log('Erro ao buscar o endereço:', erro));
}

// Exemplo de como usar a função ao digitar o CEP no campo de CEP
document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        buscarEndereco(cep);
    }
});



// Pagamento