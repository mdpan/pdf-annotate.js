copy .\node_modules\pdfjs-dist\build\pdf.js .\shared\
copy .\node_modules\pdfjs-dist\build\pdf.worker.js .\shared\
copy .\node_modules\pdfjs-dist\web\pdf_viewer.js .\shared\
copy .\node_modules\pdfjs-dist\web\pdf_viewer.css .\shared\

xcopy /s /y .\shared\ .\docs\shared\

.\node_modules\.bin\webpack-dev-server --inline --config .\webpack.web.js --content-base .\docs