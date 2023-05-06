import os
import subprocess

import jinja2
import minify_html

PANDOC_COMMAND: list[str] = ['pandoc', '--mathjax', '--to=html5']
TEMPLATE_FILE: str = 'template.html'

INPUTS: list[str] = ['index', 'algebra']
FORMAT_INPUT: str = '{}.tex'
FORMAT_OUTPUT: str = '{}.html'
FORMAT_DOWNLOAD: str = '{}.pdf'

CSS_DIRECTORY: str = 'assets/css'
CSS_EXTENSION: str = '.css'
CSS_MINIFIED_EXTENSION: str = '.min.css'
CSS_OPEN_TAG: str = '<style>'
CSS_CLOSE_TAG: str = '</style>'

JS_DIRECTORY: str = 'assets/js'
JS_EXTENSION: str = '.js'
JS_MINIFIED_EXTENSION: str = '.min.js'
JS_OPEN_TAG: str = '<script>'
JS_CLOSE_TAG: str = '</script>'

if __name__ == '__main__':
    with open(TEMPLATE_FILE) as fp:
        template_string = fp.read()

    for f in INPUTS:
        html = subprocess.run(PANDOC_COMMAND + [FORMAT_INPUT.format(f)],
                              capture_output=True,
                              check=True,
                              text=True).stdout

        template = jinja2.Template(template_string)
        html = template.render(body=html, download=FORMAT_DOWNLOAD.format(f))
        html = minify_html.minify(html, minify_css=True, minify_js=True)

        with open(FORMAT_OUTPUT.format(f), 'w') as fp:
            fp.write(html)

    # With some hacks, also minify the included css and js files.

    for file in os.listdir(CSS_DIRECTORY):
        if not file.endswith(CSS_EXTENSION) or file.endswith(CSS_MINIFIED_EXTENSION):
            continue

        with open(os.path.join(CSS_DIRECTORY, file)) as fp:
            css = fp.read()

        css = minify_html.minify(f'{CSS_OPEN_TAG}{css}{CSS_CLOSE_TAG}', minify_css=True)

        output_file = file[:-len(CSS_EXTENSION)] + CSS_MINIFIED_EXTENSION
        with open(os.path.join(CSS_DIRECTORY, output_file), 'w') as fp:
            fp.write(css[len(CSS_OPEN_TAG):-len(CSS_CLOSE_TAG)])

    for file in os.listdir(JS_DIRECTORY):
        if not file.endswith(JS_EXTENSION) or file.endswith(JS_MINIFIED_EXTENSION):
            continue

        with open(os.path.join(JS_DIRECTORY, file)) as fp:
            js = fp.read()

        js = minify_html.minify(f'{JS_OPEN_TAG}{js}{JS_CLOSE_TAG}', minify_js=True)

        output_file = file[:-len(JS_EXTENSION)] + JS_MINIFIED_EXTENSION
        with open(os.path.join(JS_DIRECTORY, output_file), 'w') as fp:
            fp.write(js[len(JS_OPEN_TAG):-len(JS_CLOSE_TAG)])
