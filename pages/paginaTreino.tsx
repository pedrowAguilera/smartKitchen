import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = 'sua_api_key_chatgpt';

export function Treino() {
  const [load, defLoad] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [diasDisponiveis, setDiasDisponiveis] = useState("");
  const [musculoPreferido, setMusculoPreferido] = useState("");
  const [planejamento, setPlanejamento] = useState("");

  async function gerarPlanejamento() {
    defLoad(true);

    const prompt = `Crie um planejamento de treino para mim, considerando que meu objetivo é ${objetivo}, tenho disponibilidade nos dias ${diasDisponiveis} e quero desenvolver melhor ${musculoPreferido}.`;

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
        setPlanejamento(data.choices[0].message.content)
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
      <Text style={styles.header}>Academia fácil</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Planejamento de treinos</Text>
        <TextInput
          placeholder="Objetivo na academia"
          style={styles.input}
          onChangeText={text => setObjetivo(text)}
        />
        <TextInput
          placeholder="Dias disponíveis para treino"
          style={styles.input}
          onChangeText={text => setDiasDisponiveis(text)}
        />
        <TextInput
          placeholder="Músculo que queira focar"
          style={styles.input}
          onChangeText={text => setMusculoPreferido(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={gerarPlanejamento}>
        <Text style={styles.buttonText}>Gerar planejamento</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}>
        {load && (
          <View style={styles.content}>
            <Text style={styles.title}>Analisando suas preferências...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {planejamento && (
          <View style={styles.content}>
            <Text style={styles.title}>Seu planejamento de treino:</Text>
            <Text style={{ lineHeight: 24 }}>{planejamento}</Text>
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
    backgroundColor: '#3a5a40',
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

