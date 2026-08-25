document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('encaminhamento-form');
    const dataNascInput = document.getElementById('data-nasc');
    const idadeInput = document.getElementById('idade');
    const btnLimpar = document.getElementById('btn-limpar');
    
    // --- Máscara de Data e Cálculo de Idade ---
    dataNascInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{2})(\d)/, "$1/$2");
        v = v.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
        e.target.value = v.substring(0, 10);

        if (e.target.value.length === 10) {
            const parts = e.target.value.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const dataNasc = new Date(year, month, day);

            if (!isNaN(dataNasc.getTime()) && year > 1900 && year <= new Date().getFullYear()) {
                const hoje = new Date();
                let idade = hoje.getFullYear() - dataNasc.getFullYear();
                const m = hoje.getMonth() - dataNasc.getMonth();
                if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
                    idade--;
                }
                idadeInput.value = idade >= 0 ? `${idade} anos` : '';
            } else {
                idadeInput.value = '';
            }
        } else {
            idadeInput.value = '';
        }
    });

    // --- Máscaras Simples ---
    const mascaraCelular = (v) => {
        v = v.replace(/\D/g,"");
        v = v.replace(/^(\d{2})(\d)/g,"($1) $2");
        v = v.replace(/(\d)(\d{4})$/,"$1-$2");
        return v;
    }

    const mascaraSUS = (v) => {
        v = v.replace(/\D/g,"");
        v = v.replace(/(\d{4})(\d)/,"$1 $2");
        v = v.replace(/(\d{4})\s(\d{4})(\d)/,"$1 $2 $3");
        v = v.replace(/(\d{4})\s(\d{4})\s(\d{4})(\d)/,"$1 $2 $3 $4");
        return v.substring(0, 18);
    }

    document.getElementById('celular').addEventListener('input', (e) => e.target.value = mascaraCelular(e.target.value));
    document.getElementById('foneresid').addEventListener('input', (e) => e.target.value = mascaraCelular(e.target.value));
    document.getElementById('fonerecado').addEventListener('input', (e) => e.target.value = mascaraCelular(e.target.value));
    document.getElementById('sus').addEventListener('input', (e) => e.target.value = mascaraSUS(e.target.value));

    // --- Limpar Formulário ---
    btnLimpar.addEventListener('click', () => {
        if(confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
            form.reset();
            idadeInput.value = '';
        }
    });

    // --- Lógica de Impressão (Mapeamento Web -> Print) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita recarregar a página

        // Mapear os campos do formulário para os spans de impressão
        const campos = [
            'unidade', 'nome', 'mae', 'idade', 'sexo', 'sus', 
            'endereco', 'numero', 'bairro', 'foneresid', 'celular', 'fonerecado',
            'escola', 'serie', 'turno', 'encaminhamento', 'motivo', 'resp-aval'
        ];

        campos.forEach(campo => {
            const el = document.getElementById(campo);
            const printEl = document.getElementById(`print-${campo}`);
            if (el && printEl) {
                printEl.textContent = el.value || '';
            }
        });

        // Formatar Datas para pt-BR
        const formatarData = (idStr) => {
            const dataInput = document.getElementById(idStr).value;
            if (dataInput) {
                if (dataInput.includes('/')) {
                    return dataInput; // Já está no formato dd/mm/aaaa
                }
                const parts = dataInput.split('-');
                if (parts.length === 3) {
                    const [year, month, day] = parts;
                    return `${day}/${month}/${year}`;
                }
            }
            return '___/___/_____';
        };

        document.getElementById('print-data').textContent = formatarData('data-nasc');
        document.getElementById('print-data-enc').textContent = formatarData('data-enc');

        // Disparar a impressão
        window.print();
    });

    // Preencher a data atual no encaminhamento por padrão
    const hojeString = new Date().toISOString().split('T')[0];
    document.getElementById('data-enc').value = hojeString;
});
