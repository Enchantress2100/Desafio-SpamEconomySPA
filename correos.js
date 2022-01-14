//npm que se estarán usando.
const http = require('http')
const url = require('url')
const {v4:uuidv4} = require('uuid') 
const axios = require('axios')
const enviar = require('./mailer.js')
const fs = require('fs')

    //creacion del servidor 
    http
        .createServer((req, res) => {
            let { correos, asunto, contenido } = url.parse(req.url, true).query;
    
            //disponibilizando la lectura del index.html
            if (req.url == "/") {
                res.setHeader("content-type", "text/html");
                fs.readFile("index.html", "utf8", (err, data) => {
                    res.end(data);
                });
            }
            //funcion para traer la data de la api.
                    async function infoIndicador() {
                        const { data } = await axios.get('https://mindicador.cl/api')
                        const dolar = data.dolar.valor;
                        const euro = data.euro.valor;
                        const uf = data.uf.valor;
                        const utm = data.utm.valor
                         //array de valores 
                        let valores = [dolar, euro, uf, utm]
                        return valores
                    }
            
            //preparando la ruta mailing para el envío de los correos.
            if (req.url.startsWith("/mailing")) {
                infoIndicador().then((r) => {

                    //preparacion del template con la informacion de la funcion asincrona.
                    const template1 = `Hola! Los indicadores económicos de hoy son los siguientes...

*El valor del dólar del día de hoy es $ ${r[0]} pesos \n
*El valor del euro del día de hoy es $ ${r[1]} pesos \n
*El valor de la uf del día de hoy es $ ${r[2]} pesos \n
*El valor de la utm del día de hoy $ ${r[3]} pesos`
                
                    if (correos.includes(",")) {
                        //console.log(correos)
                        //console.log(contenido + template1)
                        //console.log(asunto)
                        enviar(correos, asunto, contenido + template1).then((err, data) => {
                            if (err) {
                                res.write(`<p class="alert alert-info w-25 m-auto text-center"> No se pudo enviar el correo</p>`)
                                res.end()
                            } else {
                                res.write(`<p class="alert alert-info w-25 m-auto text-center"> Correos enviados con exito =)</p>`)
                                res.end()
                        //preparacion del correo de respaldo 
                        const template2 = `Correos: ${correos.split(",")}
                        Asunto: ${asunto}
                        Contenido: ${contenido}
                        ${template1}`
                        
                        //crear la carpeta para guardar los correos de respaldo
                                fs.mkdir('./correos', () => {
                                    fs.writeFile(`./correos/${shortid}.pdf`, template2, "utf-8", (err, data) => {
                                        if (err) {
                                        console.log('no se pudo crear')
                                        } else {
                                        console.log('archivo creado')
                                        }
                                    })
                                })
                            }
                        })
                    }         
                })
            }

    //uuid para el respaldo de los correos
    let id = uuidv4()
    let shortid = id.slice(id.length - 10)
            
}).listen(3000, () => console.log("Servidor ON and working OK"))