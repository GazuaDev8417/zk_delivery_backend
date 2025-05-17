import express, { Request, Response} from 'express'
import cors from 'cors'
import * as circomlib from 'circomlibjs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'



const app = express()
const port = 3001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(cors())
app.use('/zk', express.static(path.join(__dirname, '../proofs')))


/* const addressMap: Record<string, string> = {
  "149392847195839221433552997200163008801": "Rua das Laranjeiras, 123",
  "3607056778794995795434385085847334626017449707154072104308864676240828390282": "Av. Brasil, 456",
  // Adicione outros hashes + endereços conforme necessário
} */

const addressMapPath = path.join(__dirname, './data/addressMap.json')
let addressMap:Record<string, string> = {}

try{
  const data = fs.readFileSync(addressMapPath, 'utf-8')
  addressMap = JSON.parse(data)
}catch(e){
  console.warn(`Arquivo de endereço não encontrado, usando objeto vazio: ${e}`)
}


app.post('/register-code', async(req:Request, res:Response) => {
  try{
        const { code, address } = req.body
        if(!code || !address){
          return res.status(400).json({ error: 'Código e endereço são obrigatórios '})
        }

        const snarkjs = await import('snarkjs')
        const circomlibjs = await import('circomlibjs')
        const poseidon = await circomlibjs.buildPoseidon()
        const hashBigInt = poseidon([BigInt(code)])
        const hashDecimal = poseidon.F.toString(hashBigInt)

        addressMap[hashDecimal] = address
        fs.writeFileSync(addressMapPath, JSON.stringify(addressMap, null, 2))

        res.json({
          message: 'Código registrado com sucesso',
          hash: hashDecimal,
          address
        })

  }catch(error){
    console.log(error)
    res.status(500).json({ error: 'Erro ao registrar código' })  
  }
})


app.post('/verify-proof', async (req:Request, res:Response) => {
  try {
        const { code } = req.body
        if (!code) return res.status(400).json({ error: 'Código secreto é obrigatório' })

        //const codeBigInt = BigInt(code)
        const poseidon = await circomlib.buildPoseidon()
        const hash = poseidon.F.toString(poseidon([code]))
        const input = { code }

        fs.writeFileSync('inputs/input.json', JSON.stringify(input))

        execSync('node circuits/reveal_js/generate_witness.js circuits/reveal_js/reveal.wasm inputs/input.json witness.wtns')
        execSync('npx snarkjs groth16 prove zkey/circuit_final.zkey witness.wtns proofs/proof.json proofs/public.json')


        const proof = JSON.parse(fs.readFileSync(path.join(__dirname, '../proofs/proof.json'), 'utf-8'))
        const pub = JSON.parse(fs.readFileSync(path.join(__dirname, '../proofs/public.json'), 'utf-8'))
        const vk = JSON.parse(fs.readFileSync(path.join(__dirname, '../proofs/verification_key.json'), 'utf-8'))


        const snarkjs = await import('snarkjs')
        const valid = await snarkjs.groth16.verify(vk, pub, proof)        
        const hashDecimal = pub[0]
        const deliveryAddress = addressMap[hashDecimal] || null

        
        if(!valid || !deliveryAddress){
          return res.status(400).json({ valid: false, error: 'Prova inválida ou endereço não encontrado' })
        }

        res.json({
          valid: true,
          address: deliveryAddress
        })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao gerar prova' })
  }
})

app.listen(port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`)
})