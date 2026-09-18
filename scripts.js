function escolher(opcao) {
    
    const narrativa = document.querySelector(".narrative");

    

    if (opcao === 1) {

        let texto = document.getElementById("txt");
        texto.textContent = "Raphael entra na floresta. As árvores ficam cada vez mais densas. Algo parece estar observando seus passos.Você sente uma presença...";

    }

    else if (opcao === 2) {

        texto = `
            <p>
                Raphael começa a subir a montanha.
            </p>

            <p>
                O caminho é íngreme, mas existe uma
                estranha luz no topo.
            </p>

            <p class="important">
                Talvez exista alguém lá em cima.
            </p>
        `;

    }

    else if (opcao === 3) {

        texto = `
            <p>
                Raphael segue em direção à fumaça.
            </p>

            <p>
                Depois de alguns minutos,
                ele encontra os restos de uma fogueira.
            </p>

            <p class="dialogue">
                — Alguém esteve aqui recentemente...
            </p>
        `;

    }

    else if (opcao === 4) {

        texto = `
            <p>
                Raphael decide voltar.
            </p>

            <p>
                Porém, depois de alguns passos,
                percebe que o caminho desapareceu.
            </p>

            <p class="important">
                Você não está mais sozinho.
            </p>
        `;

    }

    narrativa.innerHTML = texto;

}
