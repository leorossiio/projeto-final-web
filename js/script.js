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

document.addEventListener('DOMContentLoaded', function () {
    exibirProdutosCarrinho();
    calcularTotal();
});

function exibirProdutosCarrinho() {
    const listaProdutos = document.getElementById('lista-produtos');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    listaProdutos.innerHTML = '';
    if (carrinho.length === 0) {
        listaProdutos.innerHTML = '<p>Nenhum produto no carrinho.</p>';
        return;
    }
    carrinho.forEach((produto, index) => {
        const produtoCard = `
            <div class="produto-carrinho card produto-card">
                <img src="../assets/imagens/produtos/${produto.imagem}.png" class="card-img-top" alt="${produto.nome}">
                <h5>${produto.nome}</h5>
                <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
                <div style="text-align: center; margin: 1rem 0;">
                <button class="remover-item" data-index="${index}">X</button>
                </div>
            </div>
        `;
        listaProdutos.innerHTML += produtoCard;
    });
    document.querySelectorAll('.remover-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            removerItemDoCarrinho(index);
        });
    });
}

function calcularTotal() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let total = 0;
    carrinho.forEach(produto => {
        total += produto.preco;
    });
    const totalValor = document.getElementById('total-valor');
    if (totalValor) {
        totalValor.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function removerItemDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirProdutosCarrinho();
    calcularTotal();
}

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${produto.nome} adicionado com sucesso!`);
    exibirProdutosCarrinho();
    calcularTotal();
}

function limparCarrinho() {
    localStorage.removeItem('carrinho');
    exibirProdutosCarrinho();
    calcularTotal();
}

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
        const buttons = document.querySelectorAll('.adicionar-carrinho');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const produtoCard = this.closest('.produto-card');
                const nomeProduto = produtoCard.querySelector('.card-title').textContent;
                const precoProduto = parseFloat(produtoCard.querySelector('.card-preco').textContent.replace('R$ ', '').replace(',', '.'));
                const imagemProduto = produtoCard.querySelector('.card-img-top').src.split('/').pop().replace('.png', '');
                const produto = { imagem: imagemProduto, nome: nomeProduto, preco: precoProduto };
                adicionarAoCarrinho(produto);
                alert(`${nomeProduto} foi adicionado ao carrinho com sucesso!`);
            });
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

function pagamento() {
    const formulario = document.querySelector('form');
    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }
    localStorage.removeItem('carrinho');
    exibirProdutosCarrinho();
    calcularTotal();
    alert("Pagamento realizado com sucesso!");
}

function carregarEstados() {
    fetch('../assets/data/estados.json')
        .then(response => response.json())
        .then(estados => {
            const selectEstado = document.getElementById('estado');
            selectEstado.innerHTML = '<option value="" disabled selected>Selecione o estado</option>';
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                selectEstado.appendChild(option);
            });
        })
        .catch(erro => console.log('Erro ao carregar estados:', erro));
}

document.addEventListener('DOMContentLoaded', carregarEstados);

function buscarEndereco(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o CEP. Verifique o número e tente novamente.");
            }
            return response.json();
        })
        .then(dados => {
            if (dados.erro) {
                alert("CEP não encontrado. Por favor, verifique o número e tente novamente.");
            } else {
                document.getElementById('logradouro').value = dados.logradouro || '';
                document.getElementById('bairro').value = dados.bairro || '';
                document.getElementById('cidade').value = dados.localidade || '';
                document.getElementById('estado').value = dados.uf || '';
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar o endereço:", erro);
            alert("Não foi possível buscar o endereço. Por favor, tente novamente.");
        });
}

document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEndereco(cep);
    } else {
        const mensagemFeedback = document.getElementById('mensagem-feedback');
        if (mensagemFeedback) {
            mensagemFeedback.textContent = 'CEP inválido. Por favor, insira um CEP com 8 dígitos.';
            mensagemFeedback.style.color = 'red';
        }
    }
});