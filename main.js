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
    selector: '.clojure',
    selector_eval_js: '.javascript',
    selector_jsx: '.language-klipse-jsx',
    selector_prolog_rules: '.language-prolog-rules',
    selector_prolog_query: '.language-prolog-query',
    selector_render_jsx: '.language-render-jsx',
    selector_es2017: '.language-es2017',
    selector_brainfuck: '.language-brainfuck',
    selector_transpile_jsx: '.language-transpile-jsx',
    selector_eval_php: '.language-klipse-eval-php',
    selector_eval_markdown: '.language-klipse-markdown',
    selector_eval_lambdaway: '.language-klipse-lambdaway',
    selector_eval_python_client: '.language-klipse-python, .language-eval-python',
    selector_eval_html: '.language-klipse-html',
    selector_sql: '.language-klipse-sql',
    selector_eval_ruby: '.language-klipse-eval-ruby, .language-eval-ruby',
    selector_eval_scheme: '.language-klipse-scheme, .language-eval-scheme',
    selector_eval_clisp: '.language-klipse-clisp',    
    selector_eval_cpp: '.language-klipse-cpp',
    selector_google_charts: '.language-google-chart',
    selector_plot: '.language-plot',
    selector_oblivion: '.language-oblivion',
    selector_lua: '.language-klipse-lua',
    selector_js: '.language-klipse-js',
    selector_eval_ocaml: '.language-klipse-ocaml',
    selector_transpile_ocaml: '.language-transpile-ocaml',
    selector_transpile_reason_3: '.language-transpile-reason',
    selector_transpile_reason_3_to_ocaml: '.language-transpile-reason-to-ocaml',
    selector_eval_reason_3: '.language-klipse-reason',
    selector_eval_reason_3_with_types: '.language-klipse-reason-types',
    selector_eval_ocaml_with_types: '.language-klipse-ocaml-types',
    selector_ocaml_to_reason: '.language-ocaml-to-reason',
    selector_reagent: '.language-reagent',
    selector_golang: '.language-klipse-go',
  };
}

function decodeSrc(src) {
  return atob(decodeURIComponent(src));
}
  
function encodeSrc(src) {
  return encodeURIComponent(btoa(src));
}

function addSnippet(src, lang) {
  var snippet = document.createElement('div');
  snippet.className = lang;
  snippet.innerText = src;
  document.body.append(snippet);
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
    lang = 'javascript';
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
  var src;
  var lang;

  for(var pair of args.entries()) {
    var name = pair[0];
    var val = pair[1]
    if(name == 'src') {
      src = decodeSrc(val);
    } else if (name == 'lang') {
      lang = val;
    }
    if (src && lang) {
      addSnippet(src, lang);
      src = null;
      lang = null;
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

function addEventHandlers() {
  if(editModeOn()) {
    addButton('update-url', 'Update URL');
    document.getElementById('update-url').onclick = updateSearchParams;
  }
}

function main() {
  setKlipseSettings();
  addSnippets();
  addEventHandlers();
}
main();
