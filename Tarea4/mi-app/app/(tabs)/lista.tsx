import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const FONDO = '#E7EBF0';
const TINTA = '#131C2B';
const TINTA_SUAVE = '#5B6879';
const ACENTO = '#C98A16';

const ASIGNATURAS = [
  { codigo: 'PRO-210', nombre: 'Programación Aplicada', tipo: 'Laboratorio' },
  { codigo: 'PRO-211', nombre: 'Estructuras de Datos', tipo: 'Teoría' },
  { codigo: 'PRO-215', nombre: 'Bases de Datos', tipo: 'Laboratorio' },
  { codigo: 'MAT-220', nombre: 'Álgebra Lineal', tipo: 'Teoría' },
  { codigo: 'PRO-230', nombre: 'Redes y Protocolos', tipo: 'Teoría' }, s
  { codigo: 'PRO-240', nombre: 'Proyecto Aplicado', tipo: 'Taller' },
];

export default function ListaScreen() {
  return (
    <View style={styles.fondo}>
      <FlatList
        data={ASIGNATURAS}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={styles.contenido}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <Text style={styles.kicker}>Semestre actual</Text>
            <Text style={styles.titulo}>Mis asignaturas</Text>
          </View>
        }
        ListFooterComponent={
          <Pressable
            style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
            onPress={() => router.push('/')}>
            <Text style={styles.botonTexto}>Volver al inicio</Text>
          </Pressable>
        }
        renderItem={({ item }) => (
          <View style={styles.fila}>
            <Text style={styles.codigo}>{item.codigo}</Text>
            <View style={styles.datos}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.tipo}>{item.tipo}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: FONDO,
  },
  contenido: {
    padding: 20,
    gap: 10,
  },
  encabezado: {
    marginBottom: 10,
  },
  kicker: {
    color: TINTA_SUAVE,
    fontSize: 13,
  },
  titulo: {
    color: TINTA,
    fontSize: 26,
    fontWeight: '700',
  },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
  },
  codigo: {
    color: ACENTO,
    fontSize: 12,
    fontWeight: '700',
    width: 68,
  },
  datos: {
    flex: 1,
  },
  nombre: {
    color: TINTA,
    fontSize: 17,
    fontWeight: '600',
  },
  tipo: {
    color: TINTA_SUAVE,
    fontSize: 13,
  },

  boton: {
    marginTop: 18,
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
