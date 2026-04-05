(function show_source_code() {
  var url = document.currentScript.dataset.href;
  if (!url) url = "";

  var slug = "src-" + url.replace(/[^a-zA-Z0-9]/g, "_");

  // Create the shared sticky nav once; subsequent calls just add a link to it.
  var nav = document.getElementById("show-source-nav");
  if (!nav) {
    nav = document.createElement("nav");
    nav.id = "show-source-nav";
    // Insert nav before the first show-source script tag so it sits above all blocks.
    document.currentScript.parentElement.insertBefore(nav, document.currentScript);
  }

  var navLink = document.createElement("a");
  navLink.href = "#" + slug;
  navLink.textContent = url;
  nav.appendChild(navLink);

  // Build a collapsible details block.
  var details = document.createElement("details");
  details.id = slug;
  details.className = "show-source-block";
  details.open = true;

  var summary = document.createElement("summary");
  var titleLink = document.createElement("a");
  titleLink.href = url;
  titleLink.textContent = url;
  summary.appendChild(titleLink);
  details.appendChild(summary);

  var pre = document.createElement("pre");
  pre.className = "show_source";
  pre.contentEditable = "true";
  pre.spellcheck = false;
  pre.setAttribute("translate", "no");
  details.appendChild(pre);

  document.currentScript.insertAdjacentElement("afterend", details);

  fetch(url)
    .then(function (r) {
      return r.text();
    })
    .then(function (text) {
      pre.textContent = text;
    });
})();
