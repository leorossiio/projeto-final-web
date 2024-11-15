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
    let produtos = []; // Array para armazenar produtos

    fetch('../assets/data/produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data; // Armazena os produtos no array
            renderizarProdutos(produtos); // Renderiza os produtos inicialmente
        })
        .catch(error => {
            console.error("Erro ao carregar os produtos:", error);
        });

    // Função para renderizar produtos
    function renderizarProdutos(produtos) {
        const gridProdutos = document.querySelector('.grid-produtos');
        gridProdutos.innerHTML = ''; // Limpa a grid antes de renderizar

        produtos.forEach(produto => {
            const produtoCard = `
                <div class="card produto-card">
                  <img src="/assets/imagens/produtos/${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                  <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.marca}</p>
                    <p class="card-text">${produto.descricao}</p>
                    <p class="card-preco">R$ ${produto.preco}</p>
                  </div>
                </div>
              `;
            gridProdutos.innerHTML += produtoCard;
        });
    }

    // Evento do botão de filtro
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

        renderizarProdutos(produtosFiltrados); // Renderiza os produtos filtrados
    });
});


