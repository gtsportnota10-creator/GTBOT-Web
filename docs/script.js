function adicionarLinha() {
    const lista = document.getElementById("listaItens");

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td data-label="Item"><input placeholder="Ex: Camiseta"></td>
        <td data-label="Tamanho"><input placeholder="P, M, G"></td>
        <td data-label="Número"><input placeholder="00"></td>
        <td data-label="Qtd"><input type="number" min="1" placeholder="1"></td>
        <td><button class="btn-remove" onclick="this.closest('tr').remove()">❌</button></td>
    `;

    lista.appendChild(tr);
}

// cria 1 linha inicial
adicionarLinha();

/* ================================
   GERAR ARQUIVO GTB (PADRÃO MACRO)
================================ */
function gerarArquivo() {
    let conteudo = "";
    conteudo += "DADOS DO CLIENTE;\n";

    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    conteudo += `NOME;${nomeCliente}\n`;
    conteudo += `TELEFONE;${telefone}\n`;
    conteudo += ";\n";
    conteudo += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    const linhas = document.querySelectorAll("#listaItens tr");
    let temLinha = false;

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");
        const item = inputs[0].value || "";
        const tamanho = inputs[1].value || "";
        const numero = inputs[2].value || "";
        const quantidade = inputs[3].value || "";

        if (item || tamanho || numero || quantidade) {
            temLinha = true;
            conteudo += `${item};${tamanho};${numero};${quantidade}\n`;
        }
    });

    if (!temLinha) {
        alert("Preencha pelo menos um item.");
        return;
    }

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "GTBOT_DADOS_PACOTE.gtb";
    a.click();
}

/* ================================
   COMPARTILHAR TEXTO (WHATSAPP)
================================ */
function compartilharPedido() {
    let texto = "DADOS DO CLIENTE;\n";

    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    texto += `NOME;${nomeCliente}\n`;
    texto += `TELEFONE;${telefone}\n`;
    texto += ";\n";
    texto += "ITEM;TAMANHO;NÚMERO;QUANTIDADE\n";

    const linhas = document.querySelectorAll("#listaItens tr");
    let temItem = false;

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");
        const item = inputs[0].value || "";
        const tamanho = inputs[1].value || "";
        const numero = inputs[2].value || "";
        const quantidade = inputs[3].value || "";

        if (item || tamanho || numero || quantidade) {
            temItem = true;
            texto += `${item};${tamanho};${numero};${quantidade}\n`;
        }
    });

    if (!temItem) {
        alert("Preencha pelo menos um item.");
        return;
    }

    if (navigator.share) {
        navigator.share({
            title: "Pedido GTBOT",
            text: texto
        }).catch(() => {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`);
        });
    } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`);
    }
}
