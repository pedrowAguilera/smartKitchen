import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = 'sua_api_key_chatgpt';

export function Pc() {
  const [load, defLoad] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [valor, setValor] = useState("");
  const [peca, setPeca] = useState("");
  const [recomendacao, setRecomendacao] = useState("");

  async function obterRecomendacao() {
    defLoad(true);
    Keyboard.dismiss();

    // Exemplo de prompt para a API
    const prompt = `Sugira uma configuração para meu pc considerando que meu objetivo é ${objetivo}, tenho ${valor} para gastar, gostaria que tivesse ${peca} nessa configuração.`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setRecomendacao(data.choices[0].message.content)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        defLoad(false);
      })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#f1f1f1" />
      <Text style={styles.header}>Computador fácil</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Melhor configuração para seu PC</Text>
        <TextInput
          placeholder="Objetivo com o computador"
          style={styles.input}
          value={objetivo}
          onChangeText={text => setObjetivo(text)}
        />
        <TextInput
          placeholder="Quanto quer gastar"
          style={styles.input}
          value={valor}
          onChangeText={text => setValor(text)}
        />
        <TextInput
          placeholder="Preferência de peça"
          style={styles.input}
          value={peca}
          onChangeText={text => setPeca(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={obterRecomendacao}>
        <Text style={styles.buttonText}>Obter configuração</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}>
        {load && (
          <View style={styles.content}>
            <Text style={styles.title}>Analisando suas preferências...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {recomendacao && (
          <View style={styles.content}>
            <Text style={styles.title}>Sua recomendação de lazer:</Text>
            <Text style={{ lineHeight: 24 }}>{recomendacao}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54,
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0077b6',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  },
});
