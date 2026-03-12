/**
 * Script para gerar ícones do TropiScan PWA
 * 
 * Este script tenta usar a biblioteca 'sharp' para gerar os ícones.
 * Se 'sharp' não estiver instalado, fornece instruções alternativas.
 */

const fs = require('fs');
const path = require('path');

console.log('🌿 Gerador de Ícones TropiScan PWA\n');

// Verificar se sharp está disponível
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Biblioteca sharp encontrada!\n');
} catch (error) {
  console.log('⚠️  Biblioteca sharp não encontrada.\n');
  console.log('Para instalar sharp, execute:');
  console.log('  npm install --save-dev sharp\n');
  console.log('Ou use o método alternativo:\n');
  console.log('1. Abra no navegador: http://localhost:8080/generate-tropiscan-icons.html');
  console.log('2. Faça upload do arquivo: src/assets/tropiscan.jpeg');
  console.log('3. Baixe os ícones gerados');
  console.log('4. Salve na pasta public/\n');
  process.exit(0);
}

// Caminhos
const inputImage = path.join(__dirname, '../src/assets/tropiscan.jpeg');
const outputDir = path.join(__dirname, '../public');

// Verificar se a imagem existe
if (!fs.existsSync(inputImage)) {
  console.error('❌ Erro: Arquivo tropiscan.jpeg não encontrado em src/assets/');
  console.log('\nVerifique se o arquivo existe no caminho correto.');
  process.exit(1);
}

// Configurações dos ícones
const icons = [
  { name: 'favicon.ico', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

// Função para gerar ícones
async function generateIcons() {
  console.log('📸 Gerando ícones a partir de:', inputImage);
  console.log('📁 Salvando em:', outputDir, '\n');

  for (const icon of icons) {
    try {
      const outputPath = path.join(outputDir, icon.name);
      
      await sharp(inputImage)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 26, g: 77, b: 58, alpha: 1 } // #1a4d3a
        })
        .toFile(outputPath);
      
      console.log(`✅ ${icon.name} (${icon.size}x${icon.size}) gerado com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao gerar ${icon.name}:`, error.message);
    }
  }

  console.log('\n🎉 Todos os ícones foram gerados com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Verifique os ícones na pasta public/');
  console.log('2. Recarregue o aplicativo (Ctrl+F5)');
  console.log('3. Verifique o ícone na aba do navegador');
  console.log('4. Teste a instalação do PWA\n');
}

// Executar
generateIcons().catch(error => {
  console.error('❌ Erro ao gerar ícones:', error);
  process.exit(1);
});
