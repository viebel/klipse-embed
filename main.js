function setKlipseSettings () {
  window.klipse_settings = {
    codemirror_options_in: {
      lineWrapping: true,
      autoCloseBrackets: true
    },
    codemirror_options_out: {
      lineWrapping: true
    },
    beautify_strings: true,
    selector: '.clojure, .clj, .cljs, .clojurescript',
    selector_eval_js: '.javascript, .js',
    selector_reagent: '.reagent',
    selector_golang: '.go, .golang',
    selector_prolog_rules: '.prolog-rules',
    selector_prolog_query: '.prolog-query',
    selector_render_jsx: '.jsx',
    selector_es2017: '.es2017',
    selector_brainfuck: '.-brainfuck',
    selector_transpile_jsx: '.transpile-jsx',
    selector_eval_php: '.php',
    selector_eval_markdown: '.markdown',
    selector_eval_lambdaway: '.klipse-lambdaway',
    selector_eval_python_client: '.python',
    selector_eval_html: '.html',
    selector_sql: '.sql',
    selector_eval_ruby: '.ruby',
    selector_eval_scheme: '.scheme',
    selector_eval_clisp: '.lisp',    
    selector_eval_cpp: '.cpp',
    selector_google_charts: '.google-chart',
    selector_plot: '.plot',
    selector_oblivion: '.oblivion',
    selector_lua: '.lua',
    selector_eval_ocaml: '.ocaml',
    selector_transpile_ocaml: '.transpile-ocaml',
    selector_transpile_reason_3: '.transpile-reason',
    selector_transpile_reason_3_to_ocaml: '.transpile-reason-to-ocaml',
    selector_eval_reason_3: '.reason',
    selector_eval_reason_3_with_types: '.reason-types',
    selector_eval_ocaml_with_types: '.ocaml-types',
    selector_ocaml_to_reason: '.ocaml-to-reason',
  };
}

function decodeSrc(src) {
  return decodeURIComponent(atob(src));
}
  
function encodeSrc(src) {
  if(src == "\u200B") {  // That's how CodeMirror renders empty snippets
    return "";
  }
  return btoa(encodeURIComponent(src));
}

function addSnippet(src, lang) {
  var wrapper = document.createElement('div');
  wrapper.dataset.language = lang;
  wrapper.className = 'klipse-snippet-wrapper';
  var snippet = document.createElement('div');
  snippet.className = lang;
  snippet.innerText = src;
  wrapper.appendChild(snippet);
  document.body.append(wrapper);
}

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function encodeSnippet(params, src, lang) {
  params.append('src', encodeSrc(src));
  params.append('lang', lang);
  return params;
}

function setSearchParams(params) {
  window.location.search = params.toString();
  var url = window.location.toString();
  console.log(url);
}

function snippetRelatedParam(name) {
  return ['src', 'lang'].includes(name);
}

function cleanedSearchParams() {
  var cleanedParams = new URLSearchParams();
  for(var pair of getSearchParams().entries()) {
    if(!snippetRelatedParam(pair[0])) {
      cleanedParams.append(pair[0], pair[1]);
    }
  }
  return cleanedParams;
}

function setSnippets(params, snippets) {
  snippets.forEach(function(snippet) {
    console.log(snippet.innerText);
    src = snippet.innerText;
    lang = snippet.parentElement.dataset.language;
    encodeSnippet(params, src, lang);
  });
  return params;
}

function updateSearchParams() {
  var snippets = Array.from(document.getElementsByClassName('klipse-snippet'));
  var params = cleanedSearchParams();
  setSnippets(params, snippets);
  setSearchParams(params);
  return params;
}

function addSnippets() {
  var args = getSearchParams();
  var src = '';
  var lang;

  for(var pair of args.entries()) {
    var name = pair[0];
    var val = pair[1]
    if(name == 'src') {
      src = decodeSrc(val);
    } else if (name == 'lang') {
      addSnippet(src, val);
      src = '';
      lang = val;
    }
  }
}

function addButton(id, text) {
  var button = document.createElement('button');
  button.id = id;
  button.innerHTML = text;
  document.body.append(button);
}

function editModeOn() {
  return getSearchParams().get("edit") == "1";
}

function newSnippet() {
}

function addEventHandlers() {
  if(editModeOn()) {
    addButton('update-url', 'Update URL');
    document.getElementById('update-url').onclick = updateSearchParams;

    addButton('new-snippet', 'New Snippet');
    document.getElementById('new-snippet').onclick = newSnippet;
  }
}

function main() {
  setKlipseSettings();
  addSnippets();
  addEventHandlers();
}
main();
