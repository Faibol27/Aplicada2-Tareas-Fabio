import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ESTUDIANTE } from '@/constants/estudiante';

const FONDO = '#E7EBF0';
const TINTA = '#131C2B';
const TINTA_SUAVE = '#5B6879';
const ACENTO = '#C98A16';

export default function InicioScreen() {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');

  function mostrarTexto() {
    const limpio = texto.trim();
    setMensaje(limpio.length > 0 ? limpio : 'Escribe algo en el campo para verlo aquí.');
  }

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
      <Text style={styles.kicker}>Aplicada 2 · Tarea 4</Text>

      <View style={styles.carnet}>
        <View style={styles.franja} />
        <View style={styles.carnetCuerpo}>
          {ESTUDIANTE.carnet.length > 0 && (
            <>
              <Text style={styles.carnetEtiqueta}>Carnet</Text>
              <Text style={styles.carnetNumero}>{ESTUDIANTE.carnet}</Text>
            </>
          )}
          <Text style={styles.carnetNombre}>{ESTUDIANTE.nombre}</Text>
          <Text style={styles.carnetCarrera}>{ESTUDIANTE.carrera}</Text>
        </View>
      </View>

      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>Formulario</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje"
          placeholderTextColor={TINTA_SUAVE}
          value={texto}
          onChangeText={setTexto}
          returnKeyType="done"
          onSubmitEditing={mostrarTexto}
        />

        <Button title="Mostrar texto" color={ACENTO} onPress={mostrarTexto} />

        {mensaje.length > 0 && (
          <View style={styles.resultado}>
            <Text style={styles.resultadoTexto}>{mensaje}</Text>
          </View>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
        onPress={() => router.push('/lista')}>
        <Text style={styles.botonTexto}>Ver la lista</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: FONDO,
  },
  contenido: {
    padding: 20,
    gap: 18,
  },
  kicker: {
    color: TINTA_SUAVE,
    fontSize: 13,
  },

  carnet: {
    flexDirection: 'row',
    backgroundColor: TINTA,
    borderRadius: 14,
    overflow: 'hidden',
  },
  franja: {
    width: 7,
    backgroundColor: ACENTO,
  },
  carnetCuerpo: {
    flex: 1,
    padding: 18,
  },
  carnetEtiqueta: {
    color: '#9AA7B8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  carnetNumero: {
    color: '#F2F5F9',
    fontSize: 17,
    marginTop: 2,
  },
  carnetNombre: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 29,
    marginTop: 12,
  },
  carnetCarrera: {
    color: '#C3CCD8',
    fontSize: 14,
    marginTop: 4,
  },

  bloque: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },
  bloqueTitulo: {
    color: TINTA,
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C9D2DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: TINTA,
    backgroundColor: FONDO,
  },
  resultado: {
    borderLeftWidth: 3,
    borderLeftColor: ACENTO,
    paddingLeft: 12,
  },
  resultadoTexto: {
    color: TINTA,
    fontSize: 16,
  },

  boton: {
    backgroundColor: TINTA,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  presionado: {
    opacity: 0.7,
  },
});
