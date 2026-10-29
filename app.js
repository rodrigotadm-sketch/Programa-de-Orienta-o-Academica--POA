
'use strict';
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n;};
function safeUrl(raw){try{const u=new URL(raw,location.href);return ['https:','http:','mailto:'].includes(u.protocol)?u.href:null}catch{return null}}
function appendParagraphs(parent,items){for(const item of items||[])parent.append(el('p','',item));}
function render(data){
 document.title=data.meta?.titulo||'Programa de Orientação Acadêmica';
 $('version').textContent='Versão '+(data.meta?.versao||'9.0');
 $('brand').textContent=data.meta?.unidade||'Biomedicina UFPR';
 $('kicker').textContent=data.hero?.sobretitulo||'';
 $('heroTitle').textContent=data.hero?.titulo||'';
 $('heroDesc').textContent=data.hero?.descricao||'';
 $('heroButton').textContent=data.hero?.textoBotao||'Ver procedimentos';
 $('heroButton').href=data.hero?.destinoBotao||'#procedimentos';
 const nav=$('navigation');nav.replaceChildren();
 for(const item of data.navegacao||[]){const a=el('a','',item.texto);a.href='#'+item.id;nav.append(a)}
 const main=$('sections');main.replaceChildren();
 for(const s of data.secoes||[]){
  const section=el('section','section');section.id=s.id;
  if(s.etiqueta)section.append(el('div','tag',s.etiqueta));
  section.append(el('h2','',s.titulo));appendParagraphs(section,s.paragrafos);
  if(s.aviso)section.append(el('div','notice',s.aviso));
  if(s.links?.length){const grid=el('div','linkgrid');for(const l of s.links){const card=el('article','linkcard');card.append(el('strong','',l.titulo));const url=safeUrl(l.url);if(url){const a=el('a','',l.botao||'Acessar');a.href=url;a.target='_blank';a.rel='noopener noreferrer';card.append(a)}else card.append(el('span','small','Endereço não informado'));grid.append(card)}section.append(grid)}
  if(s.etapas?.length){const steps=el('div','steps');for(const e of s.etapas){const d=el('details');const sum=el('summary','',`${e.numero}. ${e.titulo}`);d.append(sum);const body=el('div','detail');body.append(el('div','owner','Responsável: '+e.responsavel));body.append(el('p','',e.descricao));d.append(body);steps.append(d)}section.append(steps)}
  if(s.subtitulo)section.append(el('p','small',s.subtitulo));main.append(section)
 }
 $('footerText').textContent=data.rodape||'';
 $('loading').hidden=true;
}
async function boot(){
 // O JSON incorporado permite abrir o index.html diretamente, inclusive sem servidor.
 // Em hospedagem HTTP(S), dados.json é a fonte editável principal.
 let data=window.POA_FALLBACK;
 if(location.protocol==='http:'||location.protocol==='https:'){
  try{const r=await fetch('./dados.json?v=9.0',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);data=await r.json();}catch(e){console.warn('Usando cópia local incorporada:',e)}
 }
 try{render(data)}catch(e){$('loading').textContent='Erro ao montar a página: '+e.message;console.error(e)}
}
boot();
