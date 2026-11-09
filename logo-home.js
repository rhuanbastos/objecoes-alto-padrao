/* logo-home.js
 * Faz a logo da Águia levar para a tela inicial da Plataforma Águia (app.aguiaconsultoriaimobiliaria.com).
 * Não muda a estrutura da página: só deixa a imagem da logo clicável (também com Enter no teclado).
 */
(function () {
  var APP = "https://app.aguiaconsultoriaimobiliaria.com/";
  var LOGO = /^data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAABp/;   // logo da Águia embutida nas páginas
  function ehLogo(i) {
    return i.classList.contains("brand-logo") || LOGO.test(i.getAttribute("src") || "") || /\/logo[^/]*\.(png|svg)$/i.test(i.getAttribute("src") || "");
  }
  function ir(e) { if (e) { e.preventDefault(); e.stopPropagation(); } location.href = APP; }
  function ligar() {
    // a logo pode ser uma <img> ou um bloco com role="img" (no app principal, a imagem fica sob uma camada de brilho)
    var alvos = [].slice.call(document.getElementsByTagName("img")).filter(ehLogo)
      .concat([].slice.call(document.querySelectorAll('[role="img"][aria-label*="guia Consultoria"]')));
    for (var k = 0; k < alvos.length; k++) {
      var i = alvos[k];
      if (i.getAttribute("data-home") || (i.parentElement && i.parentElement.closest("[data-home]"))) continue;
      i.setAttribute("data-home", "1");
      i.style.cursor = "pointer";
      i.setAttribute("role", "link");
      i.setAttribute("tabindex", "0");
      i.setAttribute("title", "Ir para a Plataforma Águia");
      i.addEventListener("click", ir);
      i.addEventListener("keydown", function (e) { if (e.key === "Enter") ir(e); });
    }
  }
  new MutationObserver(ligar).observe(document.documentElement, { childList: true, subtree: true });
  ligar();
})();
