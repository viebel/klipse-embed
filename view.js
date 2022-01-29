(function() {
  var klipseMinURL = "https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js" ;
  var klipseClojureURL =  "https://storage.googleapis.com/app.klipse.tech/plugin/js/klipse_plugin.js?v=8.0.1";
  function setKlipseSettings () {
    window.klipse_settings = {
      codemirror_options_in: {
        lineWrapping: true,
        lineNumbers: true,
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
      selector_brainfuck: '.brainfuck',
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

  var languageNames = {
    'brainfuck': 'Brainfuck',
    'cpp': 'CPP',
    'go': 'Go',
    'html': 'HTML',
    'javascript': 'JavaScript',
    'lisp': 'LISP',
    'lua': 'Lua',
    'markdown': 'Markdown',
    'ocaml': 'OCaml',
    'python': 'Python',
    'ruby': 'Ruby',
    'sql': 'SQL',
    'scheme': 'Scheme',
    'clojure': 'Clojure',
    'reagent': 'Reagent',
  };

  var defaultLanguage = 'javascript';

  function clojureModeOn(params) {
    return (params.get("clojure") == "1") || 
      (params.get("lang") == "clojure") ||
      (params.get("lang") == "reagent");
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

  function encodeSnippet(params, src, lang) {
    params.append('src', encodeSrc(src));
    params.append('lang', lang);
    return params;
  }

  function setSnippets(params, snippets) {
    snippets.forEach(function(snippet, index) {
      // It's not safe to read from the HTML element (line breaks are not maintained).
      src = window.klipse_editors[index].getValue();
      lang = snippet.parentElement.dataset.language;
      encodeSnippet(params, src, lang);
    });
    return params;
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
  function updatedSearchParams() {
    var snippets = Array.from(document.getElementsByClassName('klipse-snippet'));
    var params = cleanedSearchParams();
    setSnippets(params, snippets);
    return params;
  }

  function updateSearchParams() {
    var url = new URL(location);
    url.search = updatedSearchParams().toString();
    history.pushState({}, '', url);
  }

  function editModeURL() {
    var url = new URL(location);
    url.pathname =  url.pathname + 'edit.html';
    return url.toString();
  }

  function addSnippet(snippets, src, lang) {
    var container = document.createElement('div');
    container.className = 'klipse-snippet-container';
    var wrapper = document.createElement('div');
    wrapper.dataset.language = lang;
    wrapper.className = 'klipse-snippet-wrapper';
    window.wrapper = wrapper;

    var pre = document.createElement('pre');
    pre.className = lang;
    var code = document.createElement('code');
    code.innerHTML = src;
    pre.appendChild(code);
    wrapper.appendChild(pre);
    container.appendChild(wrapper);
    wrapper.onmouseleave = updateSearchParams;

    snippets.appendChild(container);
    var mention = document.createElement('div');
    mention.className = "mention";
    mention.innerHTML = `Interactive ${languageNames[lang]} snippet powered with \u2764 by <a target = '_new' href='${editModeURL()}'>Klipse</a>`;
    container.appendChild(mention);
  }

  function getSearchParams() {
    return new URLSearchParams(window.location.search);
  }

  function addSnippets() {
    var args = getSearchParams();
    var src = '';
    var lang;
    if (!args.get('lang')) {
      args.set('lang', defaultLanguage);
    }
    for(var [name, val] of args.entries()) {
      if(name == 'src') {
        src = decodeSrc(val);
      } else if (name == 'lang') {
        addSnippet(snippets, src, val);
        src = '';
        lang = val;
      }
    }
  }

  function addScript(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.append(script);
  }

  function loadKlipse() {
    var klipseURL = clojureModeOn(getSearchParams())? klipseClojureURL : klipseMinURL;
    addScript(klipseURL);
  }

  function main() {
    console.log('Klipse embed version: ', '0.0.11');
    setKlipseSettings();
    var snippets = document.getElementById('snippets');
    addSnippets(snippets);
    loadKlipse();
  }
  main();
})();
