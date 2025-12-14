import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useTheme } from '../../../context/ThemeContext';
import { useFloors, useCreateFloor, useUpdateFloor, useDeleteFloor } from '../../../hooks/useFloors';
import { floorSchema } from '../../../validations/floorSchema';

export default function FloorsScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);

  const { data: floors, isLoading, refetch } = useFloors();
  const { mutate: createFloor, isPending: isCreating } = useCreateFloor();
  const { mutate: updateFloor, isPending: isUpdating } = useUpdateFloor();
  const { mutate: deleteFloor, isPending: isDeleting } = useDeleteFloor();

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      floorNumber: Number(values.floorNumber),
    };

    if (editingFloor) {
      updateFloor(
        { id: editingFloor.id, data: payload },
        {
          onSuccess: () => {
            setModalVisible(false);
            setEditingFloor(null);
            resetForm();
          },
        }
      );
    } else {
      createFloor(payload, {
        onSuccess: () => {
          setModalVisible(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (floor) => {
    setEditingFloor(floor);
    setModalVisible(true);
  };

  const handleDelete = (floor) => {
    Alert.alert(
      'Delete Floor',
      `Are you sure you want to delete Floor ${floor.floorNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteFloor(floor.id, {
              onError: () => console.log('Delete failed'),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    setEditingFloor(null);
    setModalVisible(true);
  };

  const renderFloorCard = ({ item }) => (
    <View style={[styles.floorCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
      <View style={styles.floorInfo}>
        <View style={[styles.floorIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name="layers" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.floorDetails}>
          <Text style={[styles.floorNumber, { color: theme.colors.text }]}>Floor {item.floorNumber}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        {/* Title is usually handled by navigation header, but keeping here if needed or custom */}
        {/* <Text style={[styles.title, { color: theme.colors.text }]}>Floors</Text> */}
        <View />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </View>

      {floors?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="layers-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No floors yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Tap + to add your first floor</Text>
        </View>
      ) : (
        <FlatList
          data={floors}
          renderItem={renderFloorCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingFloor(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editingFloor ? 'Edit Floor' : 'Add New Floor'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingFloor(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                floorNumber: Number(editingFloor?.floorNumber) || '',
              }}
              validationSchema={floorSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View style={styles.form}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>Floor Number</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      },
                      touched.floorNumber && errors.floorNumber && { borderColor: theme.colors.error },
                    ]}
                    placeholder="Enter floor number"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.floorNumber.toString()}
                    onChangeText={handleChange('floorNumber')}
                    onBlur={handleBlur('floorNumber')}
                    keyboardType="number-pad"
                  />
                  {touched.floorNumber && errors.floorNumber && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.floorNumber}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.colors.primary },
                      (!isValid || isCreating || isUpdating) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color={theme.colors.textInverse} />
                    ) : (
                      <Text style={[styles.submitButtonText, { color: theme.colors.textInverse }]}>
                        {editingFloor ? 'Update Floor' : 'Create Floor'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  // title: { fontSize: 28, fontWeight: 'bold' }, // Handled by nav
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContainer: { padding: 20, paddingTop: 0 },
  floorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  floorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  floorDetails: { flex: 1 },
  floorNumber: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  floorMeta: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: { borderWidth: 1 },
  errorText: { fontSize: 12, marginTop: 4 },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600' },
});
