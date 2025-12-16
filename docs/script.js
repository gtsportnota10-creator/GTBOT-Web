function adicionarLinha(tabelaId) {
    const lista = document.getElementById(tabelaId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input placeholder="Ex: Polo"></td>
        <td><input placeholder="G"></td>
        <td><input placeholder="10"></td>
        <td><input type="number" min="1" value="1"></td>
        <td><button class="btn-remove" onclick="this.closest('tr').remove()">❌</button></td>
    `;
    lista.appendChild(tr);
}

function mostrarCardShort() {
    document.getElementById('cardShorts').style.display = 'block';
    document.getElementById('containerBtnShort').style.display = 'none';
    adicionarLinha('listaShorts');
}

// Inicializa a primeira linha de camisa
adicionarLinha('listaCamisas');

function extrairDados(tabelaId) {
    const linhas = document.querySelectorAll(`#${tabelaId} tr`);
    let dados = "";
    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll("input");
        const mod = inputs[0].value || "";
        const tam = inputs[1].value || "";
        const num = inputs[2].value || "";
        const qtd = inputs[3].value || "";
        if (mod || tam || num || qtd) {
            dados += `${mod};${tam};${num};${qtd}\n`;
        }
    });
    return dados;
}

function baixarArquivo(nome, conteudo) {
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
}

function gerarArquivo() {
    const nomeCli = document.getElementById("clienteNome").value || "CLIENTE";
    const telCli = document.getElementById("clienteTelefone").value || "";
    const cabecalho = `DADOS DO CLIENTE;\nNOME;${nomeCli}\nTELEFONE;${telCli}\n;\n`;

    const dadosCamisas = extrairDados('listaCamisas');
    const dadosShorts = extrairDados('listaShorts');

    if (dadosCamisas) {
        baixarArquivo(`GTB_CAMISAS_${nomeCli}.gtb`, cabecalho + "CAMISA;TAMANHO;NÚMERO;QUANTIDADE\n" + dadosCamisas);
    }
    
    if (dadosShorts) {
        setTimeout(() => {
            baixarArquivo(`GTB_SHORTS_${nomeCli}.gtb`, cabecalho + "SHORT;TAMANHO;NÚMERO;QUANTIDADE\n" + dadosShorts);
        }, 600);
    }

    if (!dadosCamisas && !dadosShorts) alert("Adicione pelo menos um item!");
}

function compartilharPedido() {
    const nomeCli = document.getElementById("clienteNome").value || "";
    const telCli = document.getElementById("clienteTelefone").value || "";
    let texto = `*PEDIDO GTBOT*\n*CLIENTE:* ${nomeCli}\n*TEL:* ${telCli}\n\n`;

    const camisas = extrairDados('listaCamisas');
    if (camisas) texto += `*👕 CAMISAS (MOD;TAM;Nº;QTD)*\n${camisas}\n`;

    const shorts = extrairDados('listaShorts');
    if (shorts) texto += `*🩳 SHORTS (MOD;TAM;Nº;QTD)*\n${shorts}\n`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}
