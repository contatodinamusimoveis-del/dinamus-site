/* DINAMUS — comportamento do site (tema, menu, formulário, simuladores) */
(function () {
  'use strict';
  var WA = '5577988711313';
  var brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- tema ---------- */
  var themeBtns = $$('.js-theme');
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('dinamus-tema', t); } catch (e) {}
    themeBtns.forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    });
  }
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* ---------- menu mobile ---------- */
  var menuBtn = $('.menu-btn'), mobileMenu = $('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', mobileMenu).forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- ano no rodapé ---------- */
  $$('.js-ano').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- pré-seleção de assunto no formulário ---------- */
  var formAssunto = $('#f-assunto'), formObs = $('#f-obs');
  function prefill(assunto, obs) {
    if (formAssunto && assunto) formAssunto.value = assunto;
    if (formObs && obs) formObs.value = obs;
  }
  $$('.js-prefill').forEach(function (el) {
    el.addEventListener('click', function () {
      prefill(el.getAttribute('data-assunto'), el.getAttribute('data-obs'));
    });
  });

  /* ---------- formulário de contato ---------- */
  var form = $('#form-contato');
  if (form) {
    var note = $('#form-note');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim(), whats = form.whats.value.trim();
      if (!nome || !whats) { note.textContent = 'Preencha seu nome e o WhatsApp para a gente conseguir te responder.'; return; }
      if (!form.lgpd.checked) { note.textContent = 'Marque a autorização de contato para continuar.'; return; }
      var linhas = ['Olá! Sou ' + nome + ' (' + whats + ').', 'Assunto: ' + form.assunto.value, 'Cidade: ' + form.cidade.value, 'Valor: ' + form.faixa.value, 'Prazo: ' + form.quando.value];
      if (form.obs.value.trim()) linhas.push('Obs.: ' + form.obs.value.trim());
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
      note.textContent = 'Pronto, ' + nome.split(' ')[0] + ' — abrimos o WhatsApp com os seus dados. Se a janela não abriu, chame no (77) 98871-1313.';
    });
  }

  /* ---------- helpers de simulador ---------- */
  function bindTabs(container, onPick) {
    $$('[role=tab]', container).forEach(function (t) {
      t.addEventListener('click', function () {
        $$('[role=tab]', container).forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); });
        onPick(t.getAttribute('data-key'));
      });
    });
  }
  function chips(el, labels, current, onPick) {
    el.innerHTML = '';
    labels.forEach(function (label, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = label;
      b.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      b.addEventListener('click', function () { onPick(i); });
      el.appendChild(b);
    });
  }

  /* ---------- simulador rápido (home) ---------- */
  var hSim = $('#sim-home');
  if (hSim) {
    var HOME = {
      seguros:   { vLabel: 'Valor do bem', vMin: 20000, vMax: 500000, vStep: 5000, vVal: 80000, aLabel: 'Perfil de risco', aMin: 1, aMax: 3, aStep: 1, aVal: 2, outLabel: 'Prêmio anual estimado', cta: 'Ver a página de seguros', href: 'seguros.html', nota: 'Faixa de referência de mercado para seguro auto. Não é cotação.' },
      vida:      { vLabel: 'Renda mensal da família', vMin: 1500, vMax: 40000, vStep: 500, vVal: 6000, aLabel: 'Meses de proteção', aMin: 12, aMax: 120, aStep: 6, aVal: 36, outLabel: 'Capital sugerido', cta: 'Ver a página de vida', href: 'vida.html', nota: 'Cálculo simplificado. A calculadora completa considera dívidas e reservas.' },
      consorcio: { vLabel: 'Valor do crédito', vMin: 100000, vMax: 700000, vStep: 10000, vVal: 300000, aLabel: 'Prazo', aMin: 55, aMax: 183, aStep: 1, aVal: 183, outLabel: 'Parcela estimada', cta: 'Ver a página de consórcio', href: 'consorcio.html', nota: 'Estimativa com as taxas reais dos grupos Bradesco Consórcios (assembleia de 15/10/2026). Não é proposta.' }
    };
    var hm = 'seguros', hv = 80000, ha = 2;
    var hValor = $('#hValor'), hAux = $('#hAux');
    function hRender() {
      var c = HOME[hm];
      $('#hVLabel').textContent = c.vLabel; $('#hALabel').textContent = c.aLabel;
      hValor.min = c.vMin; hValor.max = c.vMax; hValor.step = c.vStep; hValor.value = hv;
      hAux.min = c.aMin; hAux.max = c.aMax; hAux.step = c.aStep; hAux.value = ha;
      $('#hVOut').textContent = brl0.format(hv);
      $('#hVMinTxt').textContent = brl0.format(c.vMin); $('#hVMaxTxt').textContent = brl0.format(c.vMax);
      $('#hAMinTxt').textContent = hm === 'seguros' ? 'Baixo' : String(c.aMin);
      $('#hAMaxTxt').textContent = hm === 'seguros' ? 'Alto' : String(c.aMax);
      $('#hOutLabel').textContent = c.outLabel;
      $('#hNote').textContent = c.nota;
      var cta = $('#hCta'); cta.firstChild.textContent = c.cta + ' '; cta.href = c.href;
      var out, rows, aOut;
      if (hm === 'consorcio') {
        /* fatores reais Bradesco: automóvel ~16% adm + 3% fundo; imóvel ~21,5% + 3% (+ seguro mensal) */
        var imovel = hv >= 200000;
        var total = hv * (imovel ? 1.245 : 1.19) + hv * (imovel ? 0.00043 : 0.000598) * ha;
        var parc = total / ha;
        out = brl2.format(parc); aOut = ha + ' meses';
        rows = [['Crédito', brl0.format(hv)], ['Prazo', ha + ' meses'], ['Total a pagar', brl0.format(total)]];
      } else if (hm === 'seguros') {
        var f = [0.75, 1, 1.45][ha - 1], pr = hv * 0.04 * f, pn = ['Baixo', 'Médio', 'Alto'][ha - 1];
        out = brl0.format(pr); aOut = pn;
        rows = [['Valor do bem', brl0.format(hv)], ['Perfil', pn], ['Por mês', brl2.format(pr / 12)]];
      } else {
        var cap = hv * ha;
        out = brl0.format(cap); aOut = ha + ' meses';
        rows = [['Renda mensal', brl0.format(hv)], ['Proteção', ha + ' meses'], ['Equivale a', (ha / 12).toFixed(1).replace('.', ',') + ' anos de renda']];
      }
      $('#hAOut').textContent = aOut;
      $('#hOut').textContent = out;
      $('#hRows').innerHTML = rows.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
    }
    bindTabs(hSim, function (k) { hm = k; hv = HOME[k].vVal; ha = HOME[k].aVal; hRender(); });
    hValor.addEventListener('input', function () { hv = Number(hValor.value); hRender(); });
    hAux.addEventListener('input', function () { ha = Number(hAux.value); hRender(); });
    hRender();
  }

  /* ---------- simulador de consórcio ---------- */
  var cSim = $('#sim-consorcio');
  if (cSim) {
    /* Condições reais dos grupos Bradesco Consórcios em andamento
       (extração Newcon de 04/11/2026 · assembleia de 15/10/2026).
       taxa() devolve a taxa de administração praticada na faixa de prazo. */
    var SEG = {
      imoveis: {
        min: 300000, max: 700000, step: 10000, valor: 400000,
        prazos: [112, 156, 162, 174, 183], prazo: 183,
        taxa: function (p) { return p <= 112 ? 0.226 : p <= 162 ? 0.205 : 0.215; },
        fundo: 0.03, seguro: 0.00043, juros: 0.0099, rot: 'imóveis',
        lance: 'Referência real: na assembleia de 15/10/2026, os lances contemplados em imóveis ficaram entre 38% e 63% do crédito — média dos menores lances vencedores: 50%.'
      },
      autos: {
        min: 100000, max: 125000, step: 1000, valor: 104000,
        prazos: [55, 59, 67, 75, 80, 88, 91], prazo: 80,
        taxa: function (p) { return p <= 67 ? 0.155 : p <= 88 ? 0.16 : 0.17; },
        fundo: 0.03, seguro: 0.000598, juros: 0.0159, rot: 'automóveis',
        lance: 'Referência real: na assembleia de 15/10/2026, os lances contemplados em automóveis ficaram entre 22% e 55% do crédito — média dos menores lances vencedores: 40%.'
      },
      servicos: {
        min: 10000, max: 800000, step: 5000, valor: 60000,
        prazos: [24, 36, 48, 60, 80, 100], prazo: 60,
        taxa: function () { return 0.21; },
        fundo: 0.02, seguro: 0, juros: 0.0199, rot: 'serviços e pesados',
        lance: 'Serviços e pesados: grupos e lances variam — chame no WhatsApp para a condição da semana.'
      }
    };
    var csK = 'imoveis', cv = 400000, cp = 183, cl = 0;
    var credito = $('#credito'), lance = $('#lance');
    function cRender() {
      var c = SEG[csK];
      credito.min = c.min; credito.max = c.max; credito.step = c.step; credito.value = cv;
      $('#cVOut').textContent = brl0.format(cv);
      $('#cMinTxt').textContent = brl0.format(c.min); $('#cMaxTxt').textContent = brl0.format(c.max);
      $('#cPOut').textContent = cp + ' meses';
      var pr = $('#cPrazos'); pr.innerHTML = '';
      c.prazos.forEach(function (p) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = p + 'x';
        b.setAttribute('aria-pressed', p === cp ? 'true' : 'false');
        b.addEventListener('click', function () { cp = p; cRender(); });
        pr.appendChild(b);
      });
      $('#cLOut').textContent = cl + '%';
      var taxa = c.taxa(cp);
      var segMensal = cv * c.seguro;
      var totalBase = cv * (1 + taxa + c.fundo);
      var total = totalBase + segMensal * cp;
      var parc = (totalBase - totalBase * cl / 100) / cp + segMensal;
      var i = c.juros;
      var totalFin = cv * (i / (1 - Math.pow(1 + i, -cp))) * cp;
      var econ = totalFin - total;
      $('#cParcela').textContent = brl2.format(parc);
      var rows = [
        ['Crédito contratado', brl0.format(cv)], ['Prazo', cp + ' meses'],
        ['Taxa de administração', (taxa * 100).toFixed(1).replace('.', ',') + '% · ' + brl0.format(cv * taxa)],
        ['Fundo de reserva', Math.round(c.fundo * 100) + '% · ' + brl0.format(cv * c.fundo)]
      ];
      if (segMensal > 0) rows.push(['Seguro prestamista', brl2.format(segMensal) + ' por mês']);
      rows.push(['Total a pagar', brl0.format(total)]);
      var lanceInfo = $('#cLanceInfo');
      if (lanceInfo) lanceInfo.textContent = c.lance;
      $('#cRows').innerHTML = rows.map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
      $('#cCompare').textContent = 'No financiamento equivalente, o total ficaria em ' + brl0.format(totalFin) +
        (econ > 0 ? ' — uma diferença estimada de ' + brl0.format(econ) + '.' : ' — nesse cenário o financiamento sai mais barato.');
      var msg = 'Olá! Simulei no site: consórcio de ' + c.rot + ', crédito de ' + brl0.format(cv) + ' em ' + cp + ' meses, parcela estimada de ' + brl2.format(parc) + '. Quero uma proposta real.';
      $('#cProposta').setAttribute('data-obs', msg);
    }
    function cPick(k) { csK = k; cv = SEG[k].valor; cp = SEG[k].prazo; cRender(); }
    bindTabs(cSim, cPick);
    credito.addEventListener('input', function () { cv = Number(credito.value); cRender(); });
    lance.addEventListener('input', function () { cl = Number(lance.value); cRender(); });
    /* botões "Simular …" das modalidades selecionam o segmento e rolam ao simulador */
    $$('.js-goseg').forEach(function (b) {
      b.addEventListener('click', function () {
        var tabs = $$('[role=tab]', cSim), k = b.getAttribute('data-seg');
        tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-key') === k ? 'true' : 'false'); });
        cPick(k);
        document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
      });
    });
    cRender();
  }

  /* ---------- grade "grupo em andamento" (consórcio) ---------- */
  var grupo = $('#grupo-grid');
  if (grupo) {
    var wins = [7, 23, 41, 58, 76, 94, 111, 129, 147, 166];
    var cells = [];
    for (var k = 0; k < 180; k++) {
      var cell = document.createElement('i');
      if (k < 96) cells.push({ el: cell, cls: wins.indexOf(k) !== -1 ? 'win' : 'paid' });
      grupo.appendChild(cell);
    }
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) cells.forEach(function (c) { c.el.className = c.cls; });
    else {
      var idx = 0;
      var t = setInterval(function () {
        for (var n = 0; n < 2 && idx < cells.length; n++, idx++) cells[idx].el.className = cells[idx].cls;
        if (idx >= cells.length) clearInterval(t);
      }, 24);
    }
  }

  /* ---------- simulador de seguros ---------- */
  var sSim = $('#sim-seg');
  if (sSim) {
    var RAMO = {
      auto:        { rotulo: 'Valor do veículo (FIPE)', ajuda: 'Use o valor de mercado do veículo na tabela FIPE.', min: 20000, max: 500000, step: 5000, valor: 80000, taxa: 0.040, franquia: 0.05 },
      residencial: { rotulo: 'Imóvel + conteúdo', ajuda: 'Some o valor de reconstrução do imóvel e o dos bens dentro dele.', min: 50000, max: 1500000, step: 10000, valor: 300000, taxa: 0.0035, franquia: 0.02 },
      empresarial: { rotulo: 'Patrimônio segurado', ajuda: 'Estoque, maquinário, benfeitorias e equipamentos.', min: 50000, max: 3000000, step: 25000, valor: 500000, taxa: 0.0055, franquia: 0.03 },
      rc:          { rotulo: 'Limite de indenização', ajuda: 'Valor máximo que a seguradora pagaria a terceiros por sinistro.', min: 50000, max: 2000000, step: 25000, valor: 300000, taxa: 0.016, franquia: 0.04 }
    };
    var PERFIL = [{ n: 'Baixo', f: 0.75 }, { n: 'Médio', f: 1.0 }, { n: 'Alto', f: 1.45 }];
    var COBER = [{ n: 'Básica', f: 0.78 }, { n: 'Intermediária', f: 1.0 }, { n: 'Completa', f: 1.18 }];
    var srK = 'auto', sv = 80000, sp = 1, sc = 2;
    var segValor = $('#segValor');
    function sRender() {
      var r = RAMO[srK];
      $('#sVLabel').textContent = r.rotulo; $('#sHelp').textContent = r.ajuda;
      segValor.min = r.min; segValor.max = r.max; segValor.step = r.step; segValor.value = sv;
      $('#sVOut').textContent = brl0.format(sv);
      $('#sMinTxt').textContent = brl0.format(r.min); $('#sMaxTxt').textContent = brl0.format(r.max);
      $('#sPOut').textContent = PERFIL[sp].n; $('#sCOut').textContent = COBER[sc].n;
      chips($('#sPerfis'), PERFIL.map(function (p) { return p.n; }), sp, function (i) { sp = i; sRender(); });
      chips($('#sCobs'), COBER.map(function (p) { return p.n; }), sc, function (i) { sc = i; sRender(); });
      var premio = sv * r.taxa * PERFIL[sp].f * COBER[sc].f;
      $('#sPremio').textContent = brl0.format(premio);
      $('#sRows').innerHTML = [
        ['Faixa de mercado', brl0.format(premio * 0.78) + ' a ' + brl0.format(premio * 1.24)],
        ['Equivalente por mês', brl2.format(premio / 12)],
        ['Franquia de referência', srK === 'rc' ? 'conforme apólice' : brl0.format(sv * r.franquia)],
        ['Importância segurada', brl0.format(sv)]
      ].map(function (r2) { return '<div><span>' + r2[0] + '</span><b>' + r2[1] + '</b></div>'; }).join('');
    }
    bindTabs(sSim, function (k) { srK = k; sv = RAMO[k].valor; sRender(); });
    segValor.addEventListener('input', function () { sv = Number(segValor.value); sRender(); });
    sRender();
  }

  /* ---------- calculadora de vida ---------- */
  var vSim = $('#sim-vida');
  if (vSim) {
    var vr = 6000, vm = 36, vd = 50000, vs = 20000;
    var els = { vRenda: $('#vRenda'), vMeses: $('#vMeses'), vDividas: $('#vDividas'), vReserva: $('#vReserva') };
    function vRender() {
      $('#vRendaOut').textContent = brl0.format(vr);
      $('#vMesesOut').textContent = vm + ' meses';
      $('#vDividasOut').textContent = brl0.format(vd);
      $('#vReservaOut').textContent = brl0.format(vs);
      var imed = 30000 + vr * 3;
      var cap = Math.max(0, vr * vm + vd + imed - vs);
      $('#vOut').textContent = brl0.format(cap);
      $('#vRows').innerHTML = [
        ['Renda a repor', brl0.format(vr * vm)], ['Dívidas a quitar', brl0.format(vd)],
        ['Custos imediatos', brl0.format(imed)], ['(−) Reservas', '− ' + brl0.format(vs)]
      ].map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
    }
    els.vRenda.addEventListener('input', function () { vr = Number(els.vRenda.value); vRender(); });
    els.vMeses.addEventListener('input', function () { vm = Number(els.vMeses.value); vRender(); });
    els.vDividas.addEventListener('input', function () { vd = Number(els.vDividas.value); vRender(); });
    els.vReserva.addEventListener('input', function () { vs = Number(els.vReserva.value); vRender(); });
    vRender();
  }
})();
