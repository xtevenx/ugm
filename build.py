import subprocess

import jinja2
import minify_html

PANDOC_COMMAND: list[str] = ['pandoc', '--mathjax', '--to=html5']
TEMPLATE_FILE: str = 'template.html'

INPUTS: list[str] = ['math340']
FORMAT_INPUT: str = '{}.tex'
FORMAT_OUTPUT: str = '{}.html'

if __name__ == '__main__':
    with open(TEMPLATE_FILE) as fp:
        template_string = fp.read()

    for f in INPUTS:
        html = subprocess.run(PANDOC_COMMAND + [FORMAT_INPUT.format(f)],
                              capture_output=True,
                              check=True,
                              text=True).stdout

        template = jinja2.Template(template_string)
        output = template.render(body=html)
        output = minify_html.minify(output, minify_css=True, minify_js=True)

        with open(FORMAT_OUTPUT.format(f), 'w') as fp:
            fp.write(output)
