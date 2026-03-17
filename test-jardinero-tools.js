// Test El Jardinero with tools
console.log('🧪 Testing El Jardinero with plant queries...\n')

async function testWithTools() {
  const questions = [
    '¿Qué plantas tengo?',
    '¿Qué me toca regar hoy?',
    'Dame información sobre mis plantas'
  ]

  for (const question of questions) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`👤 User: ${question}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

    try {
      const response = await fetch('http://localhost:3000/api/jardinero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000',
          messages: [
            { role: 'user', content: question }
          ]
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.log('❌ Error:', error)
        continue
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullText += chunk
        process.stdout.write(chunk)
      }

      console.log(`\n\n(${fullText.length} chars)\n`)
    } catch (error) {
      console.error('💥 Exception:', error.message)
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

testWithTools()
