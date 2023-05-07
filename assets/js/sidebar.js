(function () {
  const sidebar = document.getElementById('sidebar');

  // List of section heading tags as in the tagName property.
  const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

  [
    ...document.getElementById('main').querySelectorAll(headingTags.join()),
  ].forEach((header) => {
    const link = document.createElement('a');

    link.href = '#' + header.id;
    link.textContent = header.innerText;
    link.style.marginLeft = 0.5 * headingTags.indexOf(header.tagName) + 'em';

    sidebar.append(link);
  });

  // Configure the dropdown sidebar toggle function for narrow viewports.
  document.getElementById('sidebar-button').addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-display');
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('#main')) {
      sidebar.classList.remove('sidebar-display');
    }
  });
})();
