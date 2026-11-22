async function carregarSenhas(){
    try{
        const senhas = await window.api.carregarSenhas();

        console.log("Carregar Senhas:", senhas);
    }catch(erro){
        console.error("Erro ao carregar as Senhas:", erro);
    }
}
document.addEventListener("DOMContentLoaded", carregarSenhas);