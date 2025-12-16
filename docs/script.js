function adicionarLinha() {
    const lista = document.getElementById("listaItens");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input placeholder="Ex: Polo Azul"></td>
        <td><input placeholder="G"></td>
        <td><input placeholder="10"></td>
        <td><input type="number" min="1" placeholder="1"></td>
        <td><button class="btn-remove" onclick="this.closest('tr').remove()">❌</button></td>
    `;
    lista.appendChild(tr);
}
adicionarLinha();

// ... mantenha suas funções gerarArquivo() e compartilharPedido() aqui ...
/* ================================
   GERAR ARQUIVO GTB
================================ */
function gerarArquivo() {
    let conteudo = "DADOS DO CLIENTE;\n";
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    conteudo += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;
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
   WHATSAPP
================================ */
function compartilharPedido() {
    let texto = "DADOS DO CLIENTE;\n";
    const nomeCliente = document.getElementById("clienteNome").value || "";
    const telefone = document.getElementById("clienteTelefone").value || "";

    texto += `NOME;${nomeCliente}\nTELEFONE;${telefone}\n;\n`;
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

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    
    // Tenta usar a API de compartilhamento do celular, se falhar abre o link direto
    if (navigator.share) {
        navigator.share({ title: "Pedido GTBOT", text: texto })
            .catch(() => window.open(url, '_blank'));
    } else {
        window.open(url, '_blank');
    }
}
