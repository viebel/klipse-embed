(function() {
  var klipseMinURL = "https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js" ;
  var klipseClojureURL =  "https://storage.googleapis.com/app.klipse.tech/plugin/js/klipse_plugin.js?v=8.0.1";
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

  function decodeSrc(src) {
    return decodeURIComponent(atob(src));
  }

  function encodeSrc(src) {
    if(src == "\u200B") {  // That's how CodeMirror renders empty snippets
      return "";
    }
    return btoa(encodeURIComponent(src));
  }

  function addSnippet(snippets, src, lang) {
    var wrapper = document.createElement('div');
    wrapper.dataset.language = lang;
    wrapper.className = 'klipse-snippet-wrapper';
    var pre = document.createElement('pre');
    pre.className = lang;
    var code = document.createElement('code');
    code.innerHTML = src;
    pre.appendChild(code);
    wrapper.appendChild(pre);
    if (editModeOn()) {
      var btn = addButton(wrapper, '', 'Remove ' + languageNames[lang] + ' Snippet');
      btn.className += ' removeBtn';
      btn.onclick = function() {
        wrapper.remove();
      };
    }
    snippets.appendChild(wrapper);
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
    snippets.forEach(function(snippet, index) {
      // It's not safe to read from the HTML element (line breaks are not maintained).
      src = window.klipse_editors[index].getValue();
      lang = snippet.parentElement.dataset.language;
      encodeSnippet(params, src, lang);
    });
    return params;
  }

  function updatedSearchParams() {
    var snippets = Array.from(document.getElementsByClassName('klipse-snippet'));
    var params = cleanedSearchParams();
    setSnippets(params, snippets);
    return params;
  }

  function updateSearchParams() {
    setSearchParams(updatedSearchParams());
  }

  function updateClojureParams() {
    var params = getSearchParams();
    if (params.get('clojure') == '1') {
      params.delete('clojure');
    } else {
      params.set('clojure', '1');
    }
    setSearchParams(params);
  }

  function updatePublicURL(a, init) {
    var params = init? getSearchParams() : updatedSearchParams();
    params.delete('edit');
    var url = new URL(location);
    url.search = params.toString();
    a.href = url.toString();
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
        addSnippet(snippets, src, val);
        src = '';
        lang = val;
      }
    }
  }

  function addButton(container, id, text) {
    var button = document.createElement('button');
    if(id) {
      button.id = id;
    }
    button.innerHTML = text;
    button.className = "button-8";
    container.appendChild(button);
    return button;
  }

  function configSelect(s, values, defaultValue) {
    values.forEach(function(val) {
      var el = document.createElement('option');
      el.textContent = languageNames[val];
      el.value = val;
      s.appendChild(el);
    });
    s.value = defaultValue;
    return s;
  }

  function editModeOn() {
    return getSearchParams().get("edit") == "1";
  }

  function clojureModeOn() {
    return getSearchParams().get("clojure") == "1";
  }

  function newSnippet(snippets, lang) {
    addSnippet(snippets, '', lang);
    klipse.plugin.init(window.klipse_settings);
  }

  function languages() {
    var languages = [
      'brainfuck',
      'cpp',
      'go',
      'html',
      'javascript',
      'lisp',
      'lua',
      'markdown',
      'ocaml',
      'python',
      'ruby',
      'sql',
      'scheme'];

    var clojureLanguages = [
      'clojure',
      'reagent',
    ];

    if (clojureModeOn()) {
      languages =  languages.concat(clojureLanguages);
    }

    return languages.sort();
  }

  function addEventHandlers(snippets) {
    if(editModeOn()) {

      document.getElementById('buttons').style.visibility = "visible";

      document.getElementById('update-url').onclick = updateSearchParams;
      var clojureBtn = document.getElementById('add-clojure');
      clojureBtn.innerHTML = clojureModeOn()? "Deactivate Clojure" : "Activate Clojure";
      clojureBtn.onclick = updateClojureParams;

      var publicURL = document.getElementById('public-url');
      updatePublicURL(publicURL, true);
      document.getElementById('publish-url').onclick = function() {
        updatePublicURL(publicURL);
      };
      var langSelector = document.getElementById('lang-select');
      configSelect(langSelector, languages(), 'javascript');

      document.getElementById('new-snippet').onclick = function() {
        newSnippet(snippets, langSelector.value);
      }
    }
  }

  function addScript(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.append(script);
  }

  function loadKlipse() {
    var klipseURL = clojureModeOn()? klipseClojureURL : klipseMinURL;
    addScript(klipseURL);
  }

  function main() {
    console.log('Klipse embed version: ', '0.0.2');
    setKlipseSettings();
    var snippets = document.getElementById('snippets');
    addSnippets(snippets);
    addEventHandlers(snippets);
    loadKlipse();
  }
  main();
})();
