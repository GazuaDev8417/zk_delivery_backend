// scripts/setup.ts
import { execSync } from 'child_process'
import fs from 'fs'

const setup = () => {
  try {
    // Criar pastas se não existirem
    if (!fs.existsSync('ptau')) fs.mkdirSync('ptau')
    if (!fs.existsSync('zkey')) fs.mkdirSync('zkey')
    if (!fs.existsSync('proofs')) fs.mkdirSync('proofs')

    // Compilar circuito apenas se ainda não existir
    if (!fs.existsSync('circuits/reveal.r1cs')) {
      console.log('🔧 Compilando circuito...')
      execSync('circom circuits/reveal.circom --r1cs --wasm --sym -o circuits -l node_modules')
    } else {
      console.log('✅ circuits/reveal.r1cs já existe. Pulando compilação do circuito...')
    }

    // Etapa 1: Gerar Powers of Tau inicial
    if (!fs.existsSync('ptau/pot12_0000.ptau')) {
      console.log('⚡ Gerando arquivo Powers of Tau inicial...')
      execSync('npx snarkjs powersoftau new bn128 12 ptau/pot12_0000.ptau -v')
    } else {
      console.log('✅ ptau/pot12_0000.ptau já existe. Pulando...')
    }

    // Etapa 2: Contribuir
    if (!fs.existsSync('ptau/pot12_final.ptau')) {
      console.log('🤝 Contribuindo para Powers of Tau...')
      execSync(
        'npx snarkjs powersoftau contribute ptau/pot12_0000.ptau ptau/pot12_final.ptau --name="Contribuição local" -v',
        { input: Buffer.from('entropia-qualquer\n') }
      )
    } else {
      console.log('✅ ptau/pot12_final.ptau já existe. Pulando...')
    }

    // Etapa 3: Preparar para fase 2
    if (!fs.existsSync('ptau/pot12_final_prep.ptau')) {
      console.log('🧠 Preparando arquivo ptau para fase 2...')
      execSync('npx snarkjs powersoftau prepare phase2 ptau/pot12_final.ptau ptau/pot12_final_prep.ptau')
    } else {
      console.log('✅ ptau/pot12_final_prep.ptau já existe. Pulando...')
    }

    // Etapa 4: Setup Groth16
    if (!fs.existsSync('zkey/circuit_final.zkey')) {
      console.log('⚙️ Gerando proving key com arquivo preparado...')
      execSync('npx snarkjs groth16 setup circuits/reveal.r1cs ptau/pot12_final_prep.ptau zkey/circuit_final.zkey')
    } else {
      console.log('✅ zkey/circuit_final.zkey já existe. Pulando...')
    }

    // Etapa 5: Exportar chave de verificação
    if (!fs.existsSync('proofs/verification_key.json')) {
      console.log('🔑 Exportando chave de verificação...')
      execSync('npx snarkjs zkey export verificationkey zkey/circuit_final.zkey proofs/verification_key.json')
    } else {
      console.log('✅ proofs/verification_key.json já existe. Pulando...')
    }

    console.log('🎉 Setup completo com sucesso.')
  } catch (error) {
    console.error('❌ Erro durante o setup:', error)
  }
}

setup()
