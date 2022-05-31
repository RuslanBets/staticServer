const fsp = require('fs/promises')
const http = require('http')
const folderName = 'public'



http.createServer(async (request, response) => {
  let url = request.url
  let format = url.slice(1).split('.')[1]

  const nameFiles = await (await fsp.readdir('public')).filter(name => name.endsWith('.html')).map(name => name.slice(0, -5))
  
  if (url == '/') {
    url = '/index.html'

  } else if (nameFiles.includes(url.slice(1))) {
    url += '.html'
  }




  try {
    let file = await fsp.readFile(folderName + url)
    response.writeHead(200, {'Content-Type': `${findMIME(format)}`})
    response.end(file)
  } catch (error) {
    response.statusCode = 404
    response.end(`${url.slice(1)} is not defined`)
  }


}).listen(3000)

function findMIME(format) {
  const obj = {
		html: 'text/html',
		jpeg: 'image/jpeg',
		jpg:  'image/jpeg',
		png:  'image/png',
		svg:  'image/svg+xml',
		json: 'application/json',
		js:   'text/javascript',
		css:  'text/css',
		ico:  'image/x-icon',
	};

  for (const key in obj) {
    if (format == key) {
      return obj[key]
    }
  }
}